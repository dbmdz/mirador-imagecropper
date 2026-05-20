import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ScrollIndicatedDialogContent } from "mirador";
import Image from "mui-image";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import CopyToClipboard from "./dialog/CopyToClipboard";
import RightsInformation from "./dialog/RightsInformation";
import ShareButton from "./dialog/ShareButton";
import { getAttributionString } from "./utils";

/** Converts the given absolute coordinates to relative ones with the given precision */
const toRelativeCoordinates = ({ x, y, w, h }, width, height, precision) => ({
  x: parseFloat(((x / width) * 100).toFixed(precision)),
  y: parseFloat(((y / height) * 100).toFixed(precision)),
  w: parseFloat(((w / width) * 100).toFixed(precision)),
  h: parseFloat(((h / height) * 100).toFixed(precision)),
});

const supportsClipboard = "clipboard" in navigator;

const StyledImage = styled(Image)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

/** Renders the dialog where some IIIF parameters can be defined */
const CroppingDialog = ({
  config,
  containerId,
  croppingRegion: { imageCoordinates },
  currentCanvas,
  imageServiceIds,
  label,
  requiredStatement,
  rights,
  updateConfig,
  viewType,
}) => {
  const {
    active,
    dialogOpen,
    enabled,
    roundingPrecision,
    showRightsInformation,
  } = config;
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [mirrored, setMirrored] = useState(false);
  const [quality, setQuality] = useState("default");
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(100);
  const { t } = useTranslation();
  if (
    !enabled ||
    !active ||
    !dialogOpen ||
    !currentCanvas ||
    viewType !== "single" ||
    !imageCoordinates
  ) {
    return null;
  }
  const closeDialog = () =>
    updateConfig({
      ...config,
      dialogOpen: false,
    });
  const attribution = getAttributionString(requiredStatement);
  const canvasWidth = currentCanvas.getWidth();
  const canvasHeight = currentCanvas.getHeight();
  const { x, y, w, h } = toRelativeCoordinates(
    imageCoordinates,
    canvasWidth,
    canvasHeight,
    roundingPrecision,
  );
  const region = `pct:${x},${y},${w},${h}`;
  const mirror = mirrored ? "!" : "";
  const imageUrl = `${imageServiceIds[0]}/${region}/pct:${size}/${mirror}${rotation}/${quality}.jpg`;
  const getPreviewUrl = (width) =>
    `${imageServiceIds[0]}/${region}/${width},/${mirror}${rotation}/${quality}.jpg`;
  /* The aspect ratio, which depends on the rotation, is only relevant for the preview image */
  let aspectRatio = 1;
  if (imageCoordinates.h > 0 && [0, 180].includes(rotation)) {
    aspectRatio = imageCoordinates.w / imageCoordinates.h;
  } else if (imageCoordinates.w > 0 && [90, 270].includes(rotation)) {
    aspectRatio = imageCoordinates.h / imageCoordinates.w;
  }
  return (
    <Dialog
      container={document.querySelector(`#${containerId} .mirador-viewer`)}
      fullWidth
      maxWidth="sm"
      onClose={closeDialog}
      open={dialogOpen}
      scroll="paper"
    >
      <DialogTitle component="h4">
        <Box fontWeight="fontWeightBold">
          {t("imageCropper.linkToSelectedRegion")}
        </Box>
      </DialogTitle>
      <ScrollIndicatedDialogContent dividers>
        {copiedToClipboard && (
          <Alert
            closeText={t("imageCropper.close")}
            onClose={() => setCopiedToClipboard(false)}
            severity="success"
            sx={{ mb: 1 }}
          >
            {t("imageCropper.copiedToClipboard")}
          </Alert>
        )}
        <TextField
          fullWidth
          InputProps={{
            endAdornment: (
              <CopyToClipboard
                onCopy={() => {
                  navigator.clipboard.writeText(imageUrl);
                  setCopiedToClipboard(true);
                  setTimeout(() => setCopiedToClipboard(false), 3000);
                }}
                supported={supportsClipboard}
                t={t}
              />
            ),
            readOnly: true,
          }}
          size="small"
          value={imageUrl}
          variant="outlined"
        />
        <Typography sx={{ mb: 1, mt: 1 }} variant="h5">
          {t("imageCropper.options")}
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <FormLabel
            component="legend"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {t("imageCropper.size")} <span>{size}%</span>
          </FormLabel>
          <Slider min={1} onChange={(_evt, s) => setSize(s)} value={size} />
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel component="legend">{t("imageCropper.rotation")}</FormLabel>
          <RadioGroup
            aria-label={t("imageCropper.rotation")}
            name="rotation"
            onChange={(evt) => setRotation(parseInt(evt.target.value, 10))}
            row
            value={rotation}
          >
            {[0, 90, 180, 270].map((r) => (
              <FormControlLabel
                control={<Radio />}
                key={`${r}°`}
                label={`${r}°`}
                value={r}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">
            {t("imageCropper.reflection")}
          </FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={mirrored}
                  color="primary"
                  onChange={(evt) => setMirrored(evt.target.checked)}
                />
              }
              label={t("imageCropper.mirror")}
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset">
          <FormLabel component="legend">
            {t("imageCropper.quality.label")}
          </FormLabel>
          <RadioGroup
            aria-label={t("imageCropper.quality.label")}
            name="quality"
            onChange={(evt) => setQuality(evt.target.value)}
            row
            value={quality}
          >
            {["default", "color", "gray", "bitonal"].map((q) => (
              <FormControlLabel
                control={<Radio />}
                key={q}
                label={t(`imageCropper.quality.${q}`)}
                value={q}
              />
            ))}
          </RadioGroup>
        </FormControl>
        <Typography sx={{ mb: 1 }} variant="h5">
          {t("imageCropper.preview.label")}
        </Typography>
        <Link
          href={imageUrl}
          rel="noopener"
          sx={(theme) => ({
            fontFamily: theme.typography.fontFamily ?? "sans-serif",
          })}
          target="_blank"
        >
          {t("imageCropper.preview.link")}
        </Link>
        <StyledImage
          aspectRatio={aspectRatio}
          color="transparent"
          src={getPreviewUrl(500)}
        />
        {showRightsInformation && <RightsInformation t={t} rights={rights} />}
      </ScrollIndicatedDialogContent>
      <DialogActions sx={{ flexWrap: "wrap", justifyContent: "space-between" }}>
        <ButtonGroup sx={{ flexWrap: "wrap" }}>
          {["envelope", "facebook", "pinterest", "x", "whatsapp"].map((p) => (
            <ShareButton
              attribution={attribution}
              imageUrl={imageUrl}
              key={p}
              label={label}
              provider={p}
              thumbnailUrl={getPreviewUrl(250)}
              title={t(`imageCropper.share.${p}`)}
            />
          ))}
        </ButtonGroup>
        <Button color="primary" onClick={closeDialog}>
          {t("imageCropper.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CroppingDialog.defaultProps = {
  currentCanvas: undefined,
  label: "",
  requiredStatement: [],
  rights: [],
};

CroppingDialog.propTypes = {
  config: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
    roundingPrecision: PropTypes.number.isRequired,
    showRightsInformation: PropTypes.bool.isRequired,
  }).isRequired,
  containerId: PropTypes.string.isRequired,
  croppingRegion: PropTypes.shape({
    imageCoordinates: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      w: PropTypes.number,
      h: PropTypes.number,
    }),
  }).isRequired,
  currentCanvas: PropTypes.shape({
    getHeight: PropTypes.func.isRequired,
    getWidth: PropTypes.func.isRequired,
    imageServiceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  imageServiceIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string,
  requiredStatement: PropTypes.arrayOf(
    PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.string),
    }),
  ),
  rights: PropTypes.arrayOf(PropTypes.string),
  updateConfig: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
};

export default CroppingDialog;
