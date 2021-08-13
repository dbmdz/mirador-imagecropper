import makeStyles from "@material-ui/core/styles/makeStyles";
import ShareIcon from "@material-ui/icons/Share";
import { MiradorMenuButton } from "mirador/dist/es/src/components/MiradorMenuButton";
import { Point } from "openseadragon";
import PropTypes from "prop-types";
import React from "react";
import { Rnd } from "react-rnd";

const isInsideImage = (image, width, height, { x, y, w, h }) => {
  const topLeft = image.imageToViewerElementCoordinates(new Point(0, 0));
  const topRight = image.imageToViewerElementCoordinates(new Point(width, 0));
  const bottomLeft = image.imageToViewerElementCoordinates(
    new Point(0, height)
  );
  return (
    x >= topLeft.x &&
    y >= topLeft.y &&
    x + w <= topRight.x &&
    y + h <= bottomLeft.y
  );
};

const useStyles = makeStyles(() => ({
  resizeHandle: {
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
  const ResizeHandle = <div className={resizeHandle} />;
  return (
    <Rnd
      bounds="parent"
      className={root}
      minHeight={50}
      minWidth={50}
      onDrag={(_evt, { x, y }) => {
        if (
          isInsideImage(currentImage, canvasWidth, canvasHeight, {
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
        if (
          isInsideImage(currentImage, canvasWidth, canvasHeight, { x, y, w, h })
        ) {
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
        onClick={() =>
          updateOptions({
            ...options,
            dialogOpen: true,
          })
        }
      >
        <ShareIcon color="white" />
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
  }).isRequired,
  options: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
  }).isRequired,
  setCroppingRegion: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  updateOptions: PropTypes.func.isRequired,
  viewer: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  viewType: PropTypes.string.isRequired,
};

CroppingOverlay.defaultProps = {
  viewer: undefined,
};

export default CroppingOverlay;
