import { createSlice } from '@reduxjs/toolkit'


const initialState = null

const registeredClasses = createSlice({
  name: 'registeredClasses',
  initialState,
  reducers: {
    registerReducer : (state, action) => action.payload
  },
})

export const { registerReducer } = registeredClasses.actions
export default registeredClasses.reducer