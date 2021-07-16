import makeStyles from "@material-ui/core/styles/makeStyles";
import ShareIcon from "@material-ui/icons/Share";
import { MiradorMenuButton } from "mirador/dist/es/src/components/MiradorMenuButton";
import PropTypes from "prop-types";
import React, { useState } from "react";
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
  options,
  t,
  updateOptions,
  viewer,
}) => {
  const { active, dialogOpen, enabled } = options;
  const [position, setPosition] = useState({
    left: 720,
    top: 108,
  });
  const [size, setSize] = useState({
    height: 300,
    width: 400,
  });
  const { resizeHandle, root } = useStyles();
  if (!enabled || !active || !viewer) {
    return null;
  }
  const ResizeHandle = <div className={resizeHandle} />;
  return (
    <Rnd
      bounds="parent"
      className={root}
      minHeight={50}
      minWidth={50}
      onDrag={(_evt, { x, y }) => {
        setPosition({ left: x, top: y });
      }}
      onResize={(
        _evt,
        _dir,
        { offsetHeight, offsetWidth },
        _delta,
        { x, y }
      ) => {
        setPosition({ left: x, top: y });
        setSize({ height: offsetHeight, width: offsetWidth });
      }}
      position={{
        x: position.left,
        y: position.top,
      }}
      resizeHandleComponent={{
        bottomLeft: ResizeHandle,
        bottomRight: ResizeHandle,
        topLeft: ResizeHandle,
        topRight: ResizeHandle,
      }}
      size={{
        height: size.height,
        width: size.width,
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
  options: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  updateOptions: PropTypes.func.isRequired,
  viewer: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

CroppingOverlay.defaultProps = {
  viewer: undefined,
};

export default CroppingOverlay;
