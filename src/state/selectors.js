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
  // Show the rights information defined in the manifest
  showRightsInformation: true,
};

export const defaultRegion = {
  x: 720,
  y: 108,
  w: 400,
  h: 300,
};

/** Selector to get the current cropping region for a given window */
export const getCroppingRegionForWindow = (state, { windowId }) => {
  const regions = miradorSlice(state).croppingRegions ?? {};
  return regions[windowId] ?? defaultRegion;
};

/** Selector to get text display options for a given window */
export const getWindowImageCropperOptions = createSelector(
  [getWindowConfig],
  ({ imageCropper }) => ({
    ...defaultConfig,
    ...(imageCropper ?? {}),
  })
);
