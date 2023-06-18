import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  authDetails: JSON.stringify(sessionStorage) ? true : false,
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