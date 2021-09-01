import { updateWindow } from "mirador/dist/es/src/state/actions";
import { getContainerId } from "mirador/dist/es/src/state/selectors";

import CroppingControls from "./components/CroppingControls";
import { getWindowImageCropperOptions } from "./state/selectors";

export default [
  {
    component: CroppingControls,
    mapDispatchToProps: (dispatch, { windowId }) => ({
      updateOptions: (options) =>
        dispatch(updateWindow(windowId, { imageCropper: options })),
    }),
    mapStateToProps: (state, { windowId }) => ({
      containerId: getContainerId(state),
      options: getWindowImageCropperOptions(state, { windowId }),
    }),
    mode: "add",
    target: "WindowTopBarPluginArea",
  },
];
