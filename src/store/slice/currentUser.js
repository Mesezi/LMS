import { createSlice } from '@reduxjs/toolkit'

function getAuthUserValue() {
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key.includes('authUser')) {
      return JSON.parse(sessionStorage.getItem(key));
    }
  }
  return null;
}

const initialState = {
  authDetails: getAuthUserValue(),
  userDetails: null
}

const currentUser = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authReducer: (state, action) => ({
      ...state,
      authDetails: action.payload
    }),
    detailsReducer: (state, action) => ({
      ...state,
      userDetails: action.payload
    }),

   
  },
})

export const { authReducer, detailsReducer } = currentUser.actions
export default currentUser.reducer