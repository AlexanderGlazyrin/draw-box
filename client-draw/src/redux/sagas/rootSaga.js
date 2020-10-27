import {call, put, takeEvery, all} from 'redux-saga/effects';
import {AUTH_USER, CHECK_TOKEN, LOGOUT_USER, REG_USER} from '../types';
import {setUser} from '../action-creators';

function* regSagaWorker({payload}) {
  const response = yield call(async () => {
    return await (await fetch('/reg', {
      method: 'POST',
      headers: {'Content-type': 'Application/json'},
      body: JSON.stringify(payload),
    })).json();
  })
  if (!response.error) {
    yield put(setUser(response.user));
    yield localStorage.setItem(
      'userData',
      JSON.stringify({
        token: response.token,
      }),
    );
  }
}

function* authSagaWorker({payload}) {
  const response = yield call(async () => {
    return await (await fetch('/auth', {
      method: 'POST',
      headers: {'Content-type': 'Application/json'},
      body: JSON.stringify(payload),
    })).json();
  })
  if (!response.error) {
    yield put(setUser(response.user));
    yield localStorage.setItem(
      'userData',
      JSON.stringify({
        token: response.token,
      }),
    );
  }
}

function* checkTokenSagaWorker({payload}) {
  const response = yield call(async () => {
    return await (await fetch('/check', {
      method: 'POST',
      headers: {'Content-type': 'Application/json'},
      body: JSON.stringify({token: payload}),
    })).json();
  });

  if (!response.error) {
    yield put(setUser(response.user));
  }
}

function* regSagaWatcher() {
  yield takeEvery(REG_USER, regSagaWorker);
}

function* authSagaWatcher() {
  yield takeEvery(AUTH_USER, authSagaWorker);
}

function* checkTokenSagaWatcher() {
  yield takeEvery(CHECK_TOKEN, checkTokenSagaWorker);
}

export default function* rootSaga() {
  yield all([
    regSagaWatcher(),
    authSagaWatcher(),
    checkTokenSagaWatcher(),
  ]);
}
