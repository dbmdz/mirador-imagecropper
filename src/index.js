import { updateWindow } from "mirador/dist/es/src/state/actions";
import {
  getContainerId,
  getCurrentCanvas,
  getRequiredStatement,
  getRights,
  getWindowViewType,
} from "mirador/dist/es/src/state/selectors";

import CroppingControls from "./components/CroppingControls";
import CroppingDialog from "./components/CroppingDialog";
import CroppingOverlay from "./components/CroppingOverlay";
import translations from "./locales";
import { getWindowImageCropperOptions } from "./state/selectors";

export default [
  {
    component: CroppingControls,
    config: {
      translations,
    },
    mapDispatchToProps: (dispatch, { windowId }) => ({
      updateOptions: (options) =>
        dispatch(updateWindow(windowId, { imageCropper: options })),
    }),
    mapStateToProps: (state, { windowId }) => ({
      containerId: getContainerId(state),
      options: getWindowImageCropperOptions(state, { windowId }),
      viewType: getWindowViewType(state, { windowId }),
    }),
    mode: "add",
    target: "WindowTopBarPluginArea",
  },
  {
    component: CroppingDialog,
    config: {
      translations,
    },
    mapDispatchToProps: (dispatch, { windowId }) => ({
      updateOptions: (options) =>
        dispatch(updateWindow(windowId, { imageCropper: options })),
    }),
    mapStateToProps: (state, { windowId }) => ({
      containerId: getContainerId(state),
      currentCanvas: getCurrentCanvas(state, { windowId }),
      options: getWindowImageCropperOptions(state, { windowId }),
      requiredStatement: getRequiredStatement(state, { windowId }),
      rights: getRights(state, { windowId }),
      viewType: getWindowViewType(state, { windowId }),
    }),
    mode: "add",
    target: "Window",
  },
  {
    component: CroppingOverlay,
    config: {
      translations,
    },
    mapDispatchToProps: (dispatch, { windowId }) => ({
      updateOptions: (options) =>
        dispatch(updateWindow(windowId, { imageCropper: options })),
    }),
    mapStateToProps: (state, { windowId }) => ({
      containerId: getContainerId(state),
      options: getWindowImageCropperOptions(state, { windowId }),
      viewType: getWindowViewType(state, { windowId }),
    }),
    mode: "add",
    target: "OpenSeadragonViewer",
  },
];
