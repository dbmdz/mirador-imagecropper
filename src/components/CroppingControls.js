import CropIcon from "@material-ui/icons/Crop";
import { MiradorMenuButton } from "mirador/dist/es/src/components/MiradorMenuButton";
import PropTypes from "prop-types";
import React from "react";

const CroppingControls = ({ containerId, options, t, updateOptions }) => {
  const { active, enabled } = options;
  if (!enabled) {
    return null;
  }
  return (
    <MiradorMenuButton
      aria-expanded={active}
      aria-haspopup
      aria-label={
        active ? t("deactivateImageCropping") : t("activateImageCropping")
      }
      color={active ? "primary" : ""}
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
};

export default CroppingControls;
