import { call, put, takeEvery, all } from 'redux-saga/effects';
import {REG_USER} from '../types';

function* regSagaWorker(payload) {

}

function* authSagaWorker(payload) {

}

function* logoutSagaWorker(payload) {

}

function* regSagaWatcher() {
  yield takeEvery(REG_USER, regSagaWatcher)
}

export default function* rootSaga() {
  yield all([
    regSagaWatcher(),
  ]);
}
