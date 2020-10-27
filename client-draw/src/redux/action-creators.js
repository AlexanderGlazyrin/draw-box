import {
  AUTH_USER,
  CHANGE_COLOR_BRUSH,
  CHANGE_SIZE_BRUSH, CHECK_TOKEN,
  CLEAR_FALSE,
  CLEAR_TRUE, GET_USER, LOGOUT_USER,
  REG_USER, REMOVE_USER, SET_USER,
  TOGGLE_BRUSH_MENU,
} from './types';

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

export const authUser = (payload) => {
  return {
    type: AUTH_USER,
    payload
  }
}

export const regUser = (payload) => {
  return {
    type: REG_USER,
    payload
  }
}

export const setUser = (payload) => {
  return {
    type: SET_USER,
    payload
  }
}

export const getUser = (payload) => {
  return {
    type: GET_USER,
    payload
  }
}

export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  }
}

export const removeUser = () => {
  return {
    type: REMOVE_USER,
  }
}

export const checkToken = (payload) => {
  return {
    type: CHECK_TOKEN,
    payload
  }
}
