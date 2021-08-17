import makeStyles from "@material-ui/core/styles/makeStyles";
import ShareIcon from "@material-ui/icons/Share";
import { MiradorMenuButton } from "mirador/dist/es/src/components/MiradorMenuButton";
import { Point } from "openseadragon";
import PropTypes from "prop-types";
import React from "react";
import { Rnd } from "react-rnd";

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

const getIntialRegion = (image, width, height) => {
  const { x, y, w, h } = getImageBounds(image, width, height);
  return {
    x: Math.ceil(x + w / 4),
    y: Math.ceil(y + h / 4),
    w: Math.floor(w / 2),
    h: Math.floor(h / 2),
  };
};

const isInsideImage = (bounds, { x, y, w, h }) => {
  return (
    x >= bounds.x &&
    y >= bounds.y &&
    x + w <= bounds.x + bounds.w &&
    y + h <= bounds.y + bounds.h
  );
};

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

const CroppingOverlay = ({
  containerId,
  croppingRegion,
  currentCanvas,
  options,
  setCroppingRegion,
  t,
  updateOptions,
  viewer,
  viewType,
}) => {
  const { active, dialogOpen, enabled } = options;
  const { resizeHandle, root } = useStyles();
  if (
    !enabled ||
    !active ||
    !viewer ||
    !currentCanvas ||
    viewType !== "single"
  ) {
    return null;
  }
  const canvasWidth = currentCanvas.getWidth();
  const canvasHeight = currentCanvas.getHeight();
  const currentImage = viewer.world.getItemAt(0);
  // set intial region on whole image
  if (currentImage && Object.values(croppingRegion).every((c) => c === 0)) {
    setCroppingRegion(getIntialRegion(currentImage, canvasWidth, canvasHeight));
  }
  const ResizeHandle = <div className={resizeHandle} />;
  return (
    <Rnd
      bounds="parent"
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
  setCroppingRegion: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  updateOptions: PropTypes.func.isRequired,
  viewer: PropTypes.shape({
    world: PropTypes.shape({
      getItemAt: PropTypes.func.isRequired,
    }).isRequired,
  }),
  viewType: PropTypes.string.isRequired,
};

CroppingOverlay.defaultProps = {
  currentCanvas: undefined,
  viewer: undefined,
};

export default CroppingOverlay;
