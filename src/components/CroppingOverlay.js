import makeStyles from "@material-ui/core/styles/makeStyles";
import ShareIcon from "@material-ui/icons/Share";
import { MiradorMenuButton } from "mirador/dist/es/src/components/MiradorMenuButton";
import { Point } from "openseadragon";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

/** Converts the corner points of the image to coordinates in the browser */
const getImageBounds = (image, width, height) => {
  const topLeft = image.imageToViewerElementCoordinates(new Point(0, 0));
  const topRight = image.imageToViewerElementCoordinates(new Point(width, 0));
  const bottomLeft = image.imageToViewerElementCoordinates(
    new Point(0, height)
  );
  return {
    x: Math.ceil(topLeft.x),
    y: Math.ceil(topLeft.y),
    w: Math.floor(topRight.x - topLeft.x),
    h: Math.floor(bottomLeft.y - topLeft.y),
  };
};

/** Calculates the initial region of the current image */
const getInitialRegion = (image, width, height) => {
  const { x, y, w, h } = getImageBounds(image, width, height);
  return {
    // a fourth of the image width
    x: Math.ceil(x + w / 4),
    // a fourth of the image height
    y: Math.ceil(y + h / 4),
    // the half of the image width
    w: Math.floor(w / 2),
    // the half of the image height
    h: Math.floor(h / 2),
  };
};

/** Checks if the given region is inside the bounds of the image */
const isInsideImage = (bounds, { x, y, w, h }) => {
  return (
    x >= bounds.x &&
    y >= bounds.y &&
    x + w <= bounds.x + bounds.w &&
    y + h <= bounds.y + bounds.h
  );
};

/** Converts the given region in browser coordinates to image coordinates */
const toImageCoordinates = (image, { x, y, w, h }) => {
  const topLeft = image.viewerElementToImageCoordinates(new Point(x, y));
  const topRight = image.viewerElementToImageCoordinates(new Point(x + w, y));
  const bottomLeft = image.viewerElementToImageCoordinates(new Point(x, y + h));
  return {
    x: Math.ceil(topLeft.x),
    y: Math.ceil(topLeft.y),
    w: Math.floor(topRight.x - topLeft.x),
    h: Math.floor(bottomLeft.y - topLeft.y),
  };
};

const useStyles = makeStyles(() => ({
  dialogButton: {
    backgroundColor: "rgba(255,255,255,0.8) !important",
    borderRadius: "25%",
    transform: ({ buttonOutside }) =>
      buttonOutside ? "translateX(calc(-100% - 5px))" : "translate(5px)",
    position: ({ buttonOutside }) => buttonOutside && "absolute",
    left: "0",
    top: "5px",
  },
  resizeHandle: {
    background: "white",
    border: "2px solid gray",
    boxSizing: "border-box",
    height: "50%",
    left: "25%",
    position: "absolute",
    top: "25%",
    width: "50%",
  },
  root: {
    border: "1px dashed black",
    boxShadow: "0 0 0 9999em rgba(0, 0, 0, 0.65)",
    position: "absolute",
    zIndex: "1",
  },
}));

/** Renders the overlay used for defining the cropping region by dragging and resizing */
const CroppingOverlay = ({
  containerId,
  croppingRegion,
  currentCanvas,
  options,
  resetRotation,
  setCroppingRegion,
  t,
  updateOptions,
  viewer,
  viewerConfig,
  viewType,
}) => {
  const { active, dialogOpen, enabled } = options;
  const isInitialRenderOfCanvas = Object.entries(croppingRegion)
    .filter(([k]) => k !== "imageCoordinates")
    .every(([, v]) => v === 0);
  const [buttonOutside, setButtonOutside] = useState(true);
  const { dialogButton, resizeHandle, root } = useStyles({ buttonOutside });
  useEffect(() => {
    if (isInitialRenderOfCanvas) {
      setButtonOutside(true);
    }
  }, [isInitialRenderOfCanvas]);
  if (
    !enabled ||
    !active ||
    !viewer ||
    !currentCanvas ||
    viewType !== "single"
  ) {
    return null;
  }
  /*
   * FIXME: there seems to be a bug in Mirador, that viewerConfig is null in certain situations:
   * when changing the view type, viewerConfig will be null, see https://github.com/ProjectMirador/mirador/blob/master/src/state/reducers/viewers.js#L20-L21
   * only on the first page it doesn't get reset to a valid object, on all other pages there is no problem
   */
  const { rotation = 0 } = viewerConfig ?? {};
  /*
   * FIXME: at the moment the calculation of coordinates does not work with a rotated image, so we just reset the rotation
   * This is only a problem if the user can change the rotation by e.g. the mirador-image-tools plugin
   */
  if (rotation !== 0) {
    resetRotation();
  }
  const canvasWidth = currentCanvas.getWidth();
  const canvasHeight = currentCanvas.getHeight();
  const currentImage = viewer.world.getItemAt(0);
  /* Set initial region dependant on the current image if this is the initial render for the canvas */
  if (currentImage && isInitialRenderOfCanvas) {
    setCroppingRegion(
      getInitialRegion(currentImage, canvasWidth, canvasHeight)
    );
  }
  const ResizeHandle = <div className={resizeHandle} />;
  return (
    <Rnd
      bounds="parent"
      cancel={`.${dialogButton.split(" ")[0]}`}
      className={root}
      minHeight={50}
      minWidth={50}
      onDrag={(_evt, { x, y }) => {
        const imageBounds = getImageBounds(
          currentImage,
          canvasWidth,
          canvasHeight
        );
        if (
          isInsideImage(imageBounds, {
            ...croppingRegion,
            x,
            y,
          })
        ) {
          setCroppingRegion({ x, y });
          /*
           * Put the button inside the overlay if it would be cut off by the window borders
           * (35 is the width of the button)
           */
          if (x <= 35) {
            setButtonOutside(false);
          } else {
            setButtonOutside(true);
          }
        }
      }}
      onResize={(
        _evt,
        _dir,
        { offsetHeight: h, offsetWidth: w },
        _delta,
        { x, y }
      ) => {
        const imageBounds = getImageBounds(
          currentImage,
          canvasWidth,
          canvasHeight
        );
        if (isInsideImage(imageBounds, { x, y, w, h })) {
          setCroppingRegion({ x, y, w, h });
          /*
           * Put the button inside the overlay if it would be cut off by the window borders
           * (35 is the width of the button)
           */
          if (x <= 35) {
            setButtonOutside(false);
          } else {
            setButtonOutside(true);
          }
        }
      }}
      position={{
        x: croppingRegion.x,
        y: croppingRegion.y,
      }}
      resizeHandleComponent={{
        bottomLeft: ResizeHandle,
        bottomRight: ResizeHandle,
        topLeft: ResizeHandle,
        topRight: ResizeHandle,
      }}
      size={{
        height: croppingRegion.h,
        width: croppingRegion.w,
      }}
    >
      <MiradorMenuButton
        aria-expanded={dialogOpen}
        aria-label={t("imageCropper.openDialog")}
        className={dialogButton}
        containerId={containerId}
        onClick={() => {
          setCroppingRegion({
            imageCoordinates: toImageCoordinates(currentImage, croppingRegion),
          });
          updateOptions({
            ...options,
            dialogOpen: true,
          });
        }}
        size="small"
      >
        <ShareIcon />
      </MiradorMenuButton>
    </Rnd>
  );
};

CroppingOverlay.propTypes = {
  containerId: PropTypes.string.isRequired,
  croppingRegion: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    w: PropTypes.number,
    h: PropTypes.number,
  }).isRequired,
  currentCanvas: PropTypes.shape({
    getHeight: PropTypes.func.isRequired,
    getWidth: PropTypes.func.isRequired,
  }),
  options: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
  }).isRequired,
  resetRotation: PropTypes.func.isRequired,
  setCroppingRegion: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  updateOptions: PropTypes.func.isRequired,
  viewer: PropTypes.shape({
    world: PropTypes.shape({
      getItemAt: PropTypes.func.isRequired,
    }).isRequired,
  }),
  viewerConfig: PropTypes.shape({
    rotation: PropTypes.number.isRequired,
  }),
  viewType: PropTypes.string.isRequired,
};

CroppingOverlay.defaultProps = {
  currentCanvas: undefined,
  viewer: undefined,
  viewerConfig: undefined,
};

export default CroppingOverlay;
