import ActionTypes from "mirador/dist/es/src/state/actions/action-types";
import { all, put, takeEvery } from "redux-saga/effects";

import { setCroppingRegion } from "./actions";
import { defaultRegion } from "./selectors";

/** Initializes the region to default values on canvas change */
export function* initalizeRegion({ windowId }) {
  yield put(setCroppingRegion(windowId, defaultRegion));
}

/** Root saga for the plugin */
export default function* croppingRegionSaga() {
  yield all([takeEvery(ActionTypes.SET_CANVAS, initalizeRegion)]);
}
