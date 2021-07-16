import { getWindowConfig } from "mirador/dist/es/src/state/selectors";
import { createSelector } from "reselect";

const defaultConfig = {
  // Activate the image cropping overlay
  active: false,
  // Open the settings dialog
  dialogOpen: false,
  // Enable the image cropping feature
  enabled: true,
};

/** Selector to get text display options for a given window */
export const getWindowImageCropperOptions = createSelector(
  [getWindowConfig],
  ({ imageCropper }) => ({
    ...defaultConfig,
    ...(imageCropper ?? {}),
  })
);
