import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Link from "@material-ui/core/Link";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Slider from "@material-ui/core/Slider";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import Image from "material-ui-image";
import ScrollIndicatedDialogContent from "mirador/dist/es/src/containers/ScrollIndicatedDialogContent";
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

const useStyles = makeStyles((theme) => ({
  actions: {
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  actionButtons: {
    flexWrap: "wrap",
  },
  alert: {
    marginBottom: theme.spacing(1),
  },
  legend: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  optionsHeading: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  previewHeading: {
    marginBottom: theme.spacing(1),
  },
  previewImage: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  previewLink: {
    fontFamily: "sans-serif",
  },
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
  windowId,
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
  const {
    actions,
    actionButtons,
    alert,
    legend,
    optionsHeading,
    previewHeading,
    previewImage,
    previewLink,
  } = useStyles();
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
    roundingPrecision
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
      container={document.querySelector(`#${containerId} #${windowId}`)}
      fullWidth
      maxWidth="sm"
      onClose={closeDialog}
      open={dialogOpen}
      scroll="paper"
    >
      <DialogTitle disableTypography>
        <Typography variant="h4">
          <Box fontWeight="fontWeightBold">
            {t("imageCropper.linkToSelectedRegion")}
          </Box>
        </Typography>
      </DialogTitle>
      <ScrollIndicatedDialogContent dividers>
        {copiedToClipboard && (
          <Alert
            className={alert}
            closeText={t("imageCropper.close")}
            onClose={() => setCopiedToClipboard(false)}
            severity="success"
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
        <Typography className={optionsHeading} variant="h5">
          {t("imageCropper.options")}
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" className={legend}>
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
        <Typography className={previewHeading} variant="h5">
          {t("imageCropper.preview.label")}
        </Typography>
        <Link
          className={previewLink}
          href={imageUrl}
          rel="noopener"
          target="_blank"
        >
          {t("imageCropper.preview.link")}
        </Link>
        <Image
          aspectRatio={aspectRatio}
          className={previewImage}
          color="transparent"
          src={getPreviewUrl(500)}
        />
        {showRightsInformation && <RightsInformation t={t} rights={rights} />}
      </ScrollIndicatedDialogContent>
      <DialogActions className={actions}>
        <ButtonGroup className={actionButtons}>
          {["envelope", "facebook", "pinterest", "twitter", "whatsapp"].map(
            (p) => (
              <ShareButton
                attribution={attribution}
                imageUrl={imageUrl}
                key={p}
                label={label}
                provider={p}
                thumbnailUrl={getPreviewUrl(250)}
                title={t(`imageCropper.share.${p}`)}
              />
            )
          )}
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
    })
  ),
  rights: PropTypes.arrayOf(PropTypes.string),
  t: PropTypes.func.isRequired,
  updateConfig: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
  windowId: PropTypes.string.isRequired,
};

export default CroppingDialog;
