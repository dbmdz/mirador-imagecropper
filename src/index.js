import flatten from "lodash/flatten";
import {
  updateViewport,
  updateWindow,
} from "mirador/dist/es/src/state/actions";
import {
  getContainerId,
  getCurrentCanvas,
  getCurrentCanvasWorld,
  getRequiredStatement,
  getRights,
  getWindowViewType,
} from "mirador/dist/es/src/state/selectors";

import CroppingControls from "./components/CroppingControls";
import CroppingDialog from "./components/CroppingDialog";
import CroppingOverlay from "./components/CroppingOverlay";
import translations from "./locales";
import { setCroppingRegion } from "./state/actions";
import { croppingRegionsReducer } from "./state/reducers";
import croppingRegionsSaga from "./state/sagas";
import {
  getCroppingRegionForWindow,
  getWindowImageCropperOptions,
} from "./state/selectors";

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
    mapStateToProps: (state, { windowId }) => {
      const canvasWorld = getCurrentCanvasWorld(state, { windowId });
      const imageServiceIds = flatten(
        canvasWorld.canvases.map((c) => c.imageServiceIds)
      );

      return {
        containerId: getContainerId(state),
        croppingRegion: getCroppingRegionForWindow(state, { windowId }),
        currentCanvas: getCurrentCanvas(state, { windowId }),
        imageServiceIds,
        options: getWindowImageCropperOptions(state, { windowId }),
        requiredStatement: getRequiredStatement(state, { windowId }),
        rights: getRights(state, { windowId }),
        viewType: getWindowViewType(state, { windowId }),
      };
    },
    mode: "add",
    target: "Window",
  },
  {
    component: CroppingOverlay,
    config: {
      translations,
    },
    mapDispatchToProps: (dispatch, { windowId }) => ({
      resetRotation: () => {
        dispatch(updateViewport(windowId, { rotation: 0 }));
      },
      setCroppingRegion: (region) => {
        dispatch(setCroppingRegion(windowId, region));
      },
      updateOptions: (options) =>
        dispatch(updateWindow(windowId, { imageCropper: options })),
    }),
    mapStateToProps: (state, { windowId }) => ({
      containerId: getContainerId(state),
      croppingRegion: getCroppingRegionForWindow(state, { windowId }),
      currentCanvas: getCurrentCanvas(state, { windowId }),
      options: getWindowImageCropperOptions(state, { windowId }),
      viewType: getWindowViewType(state, { windowId }),
    }),
    mode: "add",
    reducers: {
      croppingRegions: croppingRegionsReducer,
    },
    saga: croppingRegionsSaga,
    target: "OpenSeadragonViewer",
  },
];
