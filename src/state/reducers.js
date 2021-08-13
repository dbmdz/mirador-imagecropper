import { PluginActionTypes } from "./actions";

export const croppingRegionsReducer = (state = {}, action) => {
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
