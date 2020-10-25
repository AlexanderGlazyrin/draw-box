import {CHANGE_COLOR_BRUSH, CHANGE_SIZE_BRUSH, CLEAR_FALSE, CLEAR_TRUE, TOGGLE_BRUSH_MENU} from './types';

const initialState = {
  showBrushMenu: false,
  colorBrush: 'black',
  sizeBrush: 10,
  isClear: false,
}

export const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SIZE_BRUSH:
      return {...state, sizeBrush: action.payload};
    case CHANGE_COLOR_BRUSH:
      return {...state, colorBrush: action.payload};
    case TOGGLE_BRUSH_MENU:
      return {...state, showBrushMenu: !state.showBrushMenu};
    case CLEAR_TRUE:
      return {...state, isClear: true}
    case CLEAR_FALSE:
      return {...state, isClear: false}
    default:
      return state;
  }
}
