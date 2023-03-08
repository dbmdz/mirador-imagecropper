import CropIcon from "@material-ui/icons/Crop";
import { MiradorMenuButton } from "mirador/dist/es/src/components/MiradorMenuButton";
import PropTypes from "prop-types";
import React from "react";

/** Renders the button to (de)activate the cropping overlay */
const CroppingControls = ({
  config,
  containerId,
  t,
  updateConfig,
  viewType,
}) => {
  const { active, enabled } = config;
  if (!enabled || viewType !== "single") {
    return null;
  }
  return (
    <MiradorMenuButton
      aria-expanded={active}
      aria-haspopup
      aria-label={
        active ? t("imageCropper.deactivate") : t("imageCropper.activate")
      }
      color={active ? "primary" : "default"}
      containerId={containerId}
      onClick={() =>
        updateConfig({
          ...config,
          active: !active,
        })
      }
    >
      <CropIcon />
    </MiradorMenuButton>
  );
};

CroppingControls.propTypes = {
  config: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
  }).isRequired,
  containerId: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  updateConfig: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
};

export default CroppingControls;
