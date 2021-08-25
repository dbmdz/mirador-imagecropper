import CropIcon from "@material-ui/icons/Crop";
import { MiradorMenuButton } from "mirador/dist/es/src/components/MiradorMenuButton";
import PropTypes from "prop-types";
import React from "react";

/** Renders the button to (de)activate the cropping overlay */
const CroppingControls = ({
  containerId,
  options,
  t,
  updateOptions,
  viewType,
}) => {
  const { active, enabled } = options;
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
        updateOptions({
          ...options,
          active: !active,
        })
      }
    >
      <CropIcon />
    </MiradorMenuButton>
  );
};

CroppingControls.propTypes = {
  containerId: PropTypes.string.isRequired,
  options: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
  }).isRequired,
  t: PropTypes.func.isRequired,
  updateOptions: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
};

export default CroppingControls;
