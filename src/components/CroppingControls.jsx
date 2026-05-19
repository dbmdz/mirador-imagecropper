import CropIcon from "@mui/icons-material/Crop";
import { MiradorMenuButton } from "mirador";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

/** Renders the button to (de)activate the cropping overlay */
const CroppingControls = ({ config, containerId, updateConfig, viewType }) => {
  const { active, enabled } = config;
  const { t } = useTranslation();
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
  updateConfig: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
};

export default CroppingControls;
