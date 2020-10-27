import {
  CHANGE_COLOR_BRUSH,
  CHANGE_SIZE_BRUSH,
  CLEAR_FALSE,
  CLEAR_TRUE,
  REMOVE_USER,
  SET_USER,
  TOGGLE_BRUSH_MENU,
} from './types';

const initialState = {
  showBrushMenu: false,
  colorBrush: 'black',
  sizeBrush: 10,
  isClear: false,
  profile: null,
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
      return {...state, isClear: true};
    case CLEAR_FALSE:
      return {...state, isClear: false};
    case SET_USER:
      return {...state, profile: action.payload};
    case REMOVE_USER:
      return {...state, profile: null};
    default:
      return state;
  }
}
