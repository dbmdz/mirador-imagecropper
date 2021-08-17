import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
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
import Image from "material-ui-image";
import ScrollIndicatedDialogContent from "mirador/dist/es/src/containers/ScrollIndicatedDialogContent";
import PropTypes from "prop-types";
import React, { useRef, useState } from "react";

import { defaultRegion } from "../state/selectors";
import CopyToClipboard from "./dialog/CopyToClipboard";
import RightsInformation from "./dialog/RightsInformation";
import ShareButton from "./dialog/ShareButton";
import { getAttributionString } from "./utils";

const toRelativeCoordinates = ({ x, y, w, h }, width, height, precision) => ({
  x: parseFloat(((x / width) * 100).toFixed(precision)),
  y: parseFloat(((y / height) * 100).toFixed(precision)),
  w: parseFloat(((w / width) * 100).toFixed(precision)),
  h: parseFloat(((h / height) * 100).toFixed(precision)),
});

const useStyles = makeStyles((theme) => ({
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

const CroppingDialog = ({
  croppingRegion: { imageCoordinates = defaultRegion },
  currentCanvas,
  label,
  options,
  requiredStatement,
  rights,
  t,
  updateOptions,
  viewType,
}) => {
  const {
    active,
    dialogOpen,
    enabled,
    roundingPrecision,
    showRightsInformation,
  } = options;
  const inputRef = useRef();
  const [mirrored, setMirrored] = useState(false);
  const [quality, setQuality] = useState("default");
  const [rotation, setRotation] = useState(0);
  const [size, setSize] = useState(100);
  const { optionsHeading, previewHeading, previewImage, previewLink } =
    useStyles();
  if (
    !enabled ||
    !active ||
    !dialogOpen ||
    !currentCanvas ||
    viewType !== "single"
  ) {
    return null;
  }
  const closeDialog = () =>
    updateOptions({
      ...options,
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
  const imageUrl = `${currentCanvas.imageServiceIds[0]}/${region}/pct:${size}/${mirror}${rotation}/${quality}.jpg`;
  const getPreviewUrl = (width) =>
    `${currentCanvas.imageServiceIds[0]}/${region}/${width},/${mirror}${rotation}/${quality}.jpg`;
  let aspectRatio = 1;
  if (imageCoordinates.h > 0 && [0, 180].includes(rotation)) {
    aspectRatio = imageCoordinates.w / imageCoordinates.h;
  } else if (imageCoordinates.w > 0 && [90, 270].includes(rotation)) {
    aspectRatio = imageCoordinates.h / imageCoordinates.w;
  }
  return (
    <Dialog
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
        <TextField
          fullWidth
          InputProps={{
            endAdornment: (
              <CopyToClipboard
                onCopy={() => {
                  inputRef?.current?.select();
                  navigator.clipboard.writeText(imageUrl);
                }}
                supported={supportsClipboard}
                t={t}
              />
            ),
            readOnly: true,
          }}
          inputRef={inputRef}
          size="small"
          value={imageUrl}
          variant="outlined"
        />
        <Typography className={optionsHeading} variant="h5">
          {t("imageCropper.options")}
        </Typography>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">{t("imageCropper.size")}</FormLabel>
          <Slider
            min={1}
            onChange={(_evt, s) => setSize(s)}
            value={size}
            valueLabelDisplay="on"
            valueLabelFormat={(v) => `${v}%`}
          />
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
          src={getPreviewUrl(500)}
        />
        {showRightsInformation && <RightsInformation t={t} rights={rights} />}
      </ScrollIndicatedDialogContent>
      <DialogActions>
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
        <div style={{ flex: "1 0 0" }} />
        <Button color="primary" onClick={closeDialog}>
          {t("imageCropper.closeDialog")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CroppingDialog.propTypes = {
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
  label: PropTypes.string,
  options: PropTypes.shape({
    active: PropTypes.bool.isRequired,
    dialogOpen: PropTypes.bool.isRequired,
    enabled: PropTypes.bool.isRequired,
    roundingPrecision: PropTypes.number.isRequired,
    showRightsInformation: PropTypes.bool.isRequired,
  }).isRequired,
  requiredStatement: PropTypes.arrayOf(
    PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  rights: PropTypes.arrayOf(PropTypes.string),
  t: PropTypes.func.isRequired,
  updateOptions: PropTypes.func.isRequired,
  viewType: PropTypes.string.isRequired,
};

CroppingDialog.defaultProps = {
  currentCanvas: undefined,
  label: "",
  requiredStatement: [],
  rights: [],
};

export default CroppingDialog;
