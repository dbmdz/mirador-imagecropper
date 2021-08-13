export const PluginActionTypes = {
  SET_CROPPING_REGION: "mirador-imagecropper/SET_CROPPING_REGION",
};

/**
 * sets the cropping region for a specific window
 *
 * @param {String} windowId
 * @param {Object} region
 * @return the action
 */
export function setCroppingRegion(windowId, region) {
  return {
    windowId,
    region,
    type: PluginActionTypes.SET_CROPPING_REGION,
  };
}
