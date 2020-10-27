import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {applyMiddleware, createStore} from 'redux';
import createSaga from 'redux-saga';
import 'antd/dist/antd.css';
import {Provider} from 'react-redux';
import {rootReducer} from './redux/rootReducer';
import {composeWithDevTools} from 'redux-devtools-extension';
import rootSaga from './redux/sagas/rootSaga';

const sagaMiddleware = createSaga()
const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(rootSaga)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
