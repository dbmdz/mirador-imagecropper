export const PluginActionTypes = {
  SET_CROPPING_REGION: "mirador-imagecropper/SET_CROPPING_REGION",
};

/**
 * Sets the cropping region for a specific window
 *
 * @param {String} windowId
 * @param {Object} region - the region as {x,y,w,h}
 * @return the action
 */
export function setCroppingRegion(windowId, region) {
  return {
    region,
    type: PluginActionTypes.SET_CROPPING_REGION,
    windowId,
  };
}
