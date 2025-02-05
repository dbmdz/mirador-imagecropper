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
import ns from "mirador/dist/es/src/config/css-ns";
import ScrollIndicatedDialogContent from "mirador/dist/es/src/containers/ScrollIndicatedDialogContent";
import Image from "mui-image";
import PropTypes from "prop-types";
import React, { useState } from "react";

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

const StyledAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));
const StyledDialogActions = styled(DialogActions)({
  justifyContent: "space-between",
  flexWrap: "wrap",
});
const StyledButtonGroup = styled(ButtonGroup)({
  flexWrap: "wrap",
});
const StyledFormLabelLegend = styled(FormLabel)({
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
});
const StyledOptionsHeading = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  marginTop: theme.spacing(1),
}));
const StyledPreviewHeading = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(1),
}));
const StyledPreviewImage = styled(Image)(({ theme }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));
const StyledPreviewLink = styled(Link)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily ?? "sans-serif",
}));

const supportsClipboard = "clipboard" in navigator;

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
  t,
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

  /** Close imagecropper dialog */
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
  /**
   * Generates a URL for the preview image based on the given width.
   * @param {number} width - The width of the preview image.
   * @returns {string} The generated URL for the preview image.
   */
  const getPreviewUrl = (width) =>
    `${imageServiceIds[0]}/${region}/${width},/${mirror}${rotation}/${quality}.jpg`;

  return (
    <Dialog
      container={document.querySelector(`#${containerId} .${ns("viewer")}`)}
      fullWidth
      maxWidth="sm"
      onClose={closeDialog}
      open={dialogOpen}
      scroll="paper"
    >
      <DialogTitle>
        <Typography variant="h4">
          <Box fontWeight="fontWeightBold">
            {t("imageCropper.linkToSelectedRegion")}
          </Box>
        </Typography>
      </DialogTitle>
      <ScrollIndicatedDialogContent dividers>
        {copiedToClipboard && (
          <StyledAlert
            closeText={t("imageCropper.close")}
            onClose={() => setCopiedToClipboard(false)}
            severity="success"
          >
            {t("imageCropper.copiedToClipboard")}
          </StyledAlert>
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
        <StyledOptionsHeading variant="h5">
          {t("imageCropper.options")}
        </StyledOptionsHeading>
        <FormControl component="fieldset" fullWidth>
          <StyledFormLabelLegend component="legend">
            {t("imageCropper.size")} <span>{size}%</span>
          </StyledFormLabelLegend>
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
        <StyledPreviewHeading variant="h5">
          {t("imageCropper.preview.label")}
        </StyledPreviewHeading>
        <StyledPreviewLink href={imageUrl} rel="noopener" target="_blank">
          {t("imageCropper.preview.link")}
        </StyledPreviewLink>
        <StyledPreviewImage bgColor="transparent" src={getPreviewUrl(500)} />
        {showRightsInformation && <RightsInformation t={t} rights={rights} />}
      </ScrollIndicatedDialogContent>
      <StyledDialogActions>
        <StyledButtonGroup>
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
        </StyledButtonGroup>
        <Button color="primary" onClick={closeDialog}>
          {t("imageCropper.close")}
        </Button>
      </StyledDialogActions>
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
  t: PropTypes.func.isRequired,
  updateConfig: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
};

export default CroppingDialog;
