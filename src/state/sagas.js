import ActionTypes from "mirador/dist/es/src/state/actions/action-types";
import { put, takeEvery } from "redux-saga/effects";

import { setCroppingRegion } from "./actions";
import { defaultRegion } from "./selectors";

/** Resets the region to default values on canvas change */
function* initalizeRegion({ windowId }) {
  yield put(setCroppingRegion(windowId, defaultRegion));
}

/** Root saga for the plugin */
function* croppingRegionsSaga() {
  yield takeEvery(ActionTypes.SET_CANVAS, initalizeRegion);
}

export default croppingRegionsSaga;
