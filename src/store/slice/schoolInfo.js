import { createSlice } from '@reduxjs/toolkit'


const initialState = null

const schoolInfo = createSlice({
  name: 'schoolInfo',
  initialState,
  reducers: {
    infoReducer : (state, action) => action.payload
  },
})

export const { infoReducer } = schoolInfo.actions
export default schoolInfo.reducer