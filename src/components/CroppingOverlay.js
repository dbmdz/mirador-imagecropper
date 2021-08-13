import makeStyles from "@material-ui/core/styles/makeStyles";
import ShareIcon from "@material-ui/icons/Share";
import { MiradorMenuButton } from "mirador/dist/es/src/components/MiradorMenuButton";
import PropTypes from "prop-types";
import React from "react";
import { Rnd } from "react-rnd";

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
  options,
  setCroppingRegion,
  t,
  updateOptions,
  viewer,
  viewType,
}) => {
  const { active, dialogOpen, enabled } = options;
  const { resizeHandle, root } = useStyles();
  if (!enabled || !active || !viewer || viewType !== "single") {
    return null;
  }
  const ResizeHandle = <div className={resizeHandle} />;
  return (
    <Rnd
      bounds="parent"
      className={root}
      minHeight={50}
      minWidth={50}
      onDrag={(_evt, { x, y }) => setCroppingRegion({ x, y })}
      onResize={(
        _evt,
        _dir,
        { offsetHeight: h, offsetWidth: w },
        _delta,
        { x, y }
      ) => setCroppingRegion({ x, y, w, h })}
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
