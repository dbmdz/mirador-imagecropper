import flatten from "lodash/flatten";
import {
  getContainerId,
  getCurrentCanvas,
  getCurrentCanvasWorld,
  getManifestTitle,
  getRequiredStatement,
  getRights,
  getViewer,
  getWindowViewType,
  updateViewport,
  updateWindow,
} from "mirador";

import CroppingControls from "./components/CroppingControls";
import CroppingDialog from "./components/CroppingDialog";
import CroppingOverlay from "./components/CroppingOverlay";
import translations from "./locales";
import { setCroppingRegion } from "./state/actions";
import { croppingRegionsReducer } from "./state/reducers";
import croppingRegionsSaga from "./state/sagas";
import { getCroppingRegionForWindow, getPluginConfig } from "./state/selectors";

/*
 * FIXME: there seems to be a bug in Mirador, that viewerConfig is null in certain situations:
 * when changing the view type, viewerConfig will be null, see https://github.com/ProjectMirador/mirador/blob/v4.0.0/src/state/reducers/viewers.js#L30-L31
 * only on the first page it doesn't get reset to a valid object, on all other pages there is no problem
 */
const getViewerConfig = (state, windowId) =>
  getViewer(state, { windowId }) ?? {};

export default [
  {
    component: CroppingControls,
    config: {
      translations,
    },
    mapDispatchToProps: (dispatch, { windowId }) => ({
      updateConfig: (imageCropper) =>
        dispatch(updateWindow(windowId, { imageCropper })),
    }),
    mapStateToProps: (state, { windowId }) => ({
      config: getPluginConfig(state, { windowId }),
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
      updateConfig: (imageCropper) =>
        dispatch(updateWindow(windowId, { imageCropper })),
    }),
    mapStateToProps: (state, { windowId }) => {
      const canvasWorld = getCurrentCanvasWorld(state, { windowId });
      const imageServiceIds = flatten(
        canvasWorld.canvases.map((c) => c.imageServiceIds),
      );

      return {
        config: getPluginConfig(state, { windowId }),
        containerId: getContainerId(state),
        croppingRegion: getCroppingRegionForWindow(state, { windowId }),
        currentCanvas: getCurrentCanvas(state, { windowId }),
        imageServiceIds,
        label: getManifestTitle(state, { windowId }),
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
      updateConfig: (imageCropper) =>
        dispatch(updateWindow(windowId, { imageCropper })),
    }),
    mapStateToProps: (state, { windowId }) => ({
      config: getPluginConfig(state, { windowId }),
      croppingRegion: getCroppingRegionForWindow(state, { windowId }),
      currentCanvas: getCurrentCanvas(state, { windowId }),
      viewerConfig: getViewerConfig(state, windowId),
      viewType: getWindowViewType(state, { windowId }),
      windowId,
    }),
    mode: "add",
    reducers: {
      croppingRegions: croppingRegionsReducer,
    },
    saga: croppingRegionsSaga,
    target: "OpenSeadragonViewer",
  },
];
