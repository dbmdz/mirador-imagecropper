import FileCopyIcon from "@mui/icons-material/FileCopy";
import InputAdornment from "@mui/material/InputAdornment";
import { MiradorMenuButton } from "mirador";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

/** Renders the button for copying the image url to the clipboard */
const CopyToClipboard = ({ onCopy, supported }) => {
  const { t } = useTranslation();
  if (!supported) {
    return null;
  }
  return (
    <InputAdornment position="end">
      <MiradorMenuButton
        aria-label={t("imageCropper.copyToClipboard")}
        edge="end"
        onClick={onCopy}
      >
        <FileCopyIcon fontSize="small" />
      </MiradorMenuButton>
    </InputAdornment>
  );
};

CopyToClipboard.propTypes = {
  onCopy: PropTypes.func.isRequired,
  supported: PropTypes.bool.isRequired,
};

export default CopyToClipboard;
