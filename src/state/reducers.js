import { PluginActionTypes } from "./actions";

/**
 * Updates the global state of the plugin
 *
 * @param {Object} state - the current state
 * @param {Object} action - the action with the new region as payload
 * @returns the modified state if the action type matches
 */
const croppingRegionsReducer = (state = {}, action = {}) => {
  switch (action.type) {
    case PluginActionTypes.SET_CROPPING_REGION:
      return {
        ...state,
        [action.windowId]: {
          ...state[action.windowId],
          ...action.region,
        },
      };
    default:
      return state;
  }
};

export { croppingRegionsReducer };
