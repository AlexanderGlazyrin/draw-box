import {CHANGE_COLOR_BRUSH, CHANGE_SIZE_BRUSH, CLEAR_FALSE, CLEAR_TRUE, TOGGLE_BRUSH_MENU} from './types';

export const changeColor = (payload) => {
  return {
    type: CHANGE_COLOR_BRUSH,
    payload
  }
}

export const changeSize = (payload) => {
  return {
    type: CHANGE_SIZE_BRUSH,
    payload
  }
}

export const toggleBrushMenu = () => {
  return {
    type: TOGGLE_BRUSH_MENU
  }
}

export const clearTrue = () => {
  return {
    type: CLEAR_TRUE
  }
}

export const clearFalse = () => {
  return {
    type: CLEAR_FALSE
  }
}
