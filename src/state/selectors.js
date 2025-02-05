import { getWindowConfig } from "mirador/dist/es/src/state/selectors";
import { miradorSlice } from "mirador/dist/es/src/state/selectors/utils";
import { createSelector } from "reselect";

const defaultConfig = {
  // Activate the image cropping overlay
  active: false,
  // Open the settings dialog
  dialogOpen: false,
  // Enable the image cropping feature
  enabled: true,
  // Define the rounding percision for the relative coordinates
  roundingPrecision: 5,
  // Show the rights information defined in the manifest
  showRightsInformation: true,
};

const defaultRegion = {
  x: 0,
  y: 0,
  w: 0,
  h: 0,
};

/** Selector to get the current cropping region for a given window */
const getCroppingRegionForWindow = (state, { windowId }) => {
  const regions = miradorSlice(state).croppingRegions ?? {};
  return regions[windowId] ?? defaultRegion;
};

/** Selector to get the plugin config for a given window */
const getPluginConfig = createSelector(
  [getWindowConfig],
  ({ imageCropper = {} }) => {
    let { roundingPrecision } = imageCropper;
    if (
      typeof roundingPrecision !== "number" ||
      roundingPrecision < 0 ||
      roundingPrecision > 20
    ) {
      roundingPrecision = 5;
    }
    return {
      ...defaultConfig,
      ...imageCropper,
      roundingPrecision,
    };
  },
);

export { defaultRegion, getCroppingRegionForWindow, getPluginConfig };
