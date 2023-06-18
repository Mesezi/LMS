import { createSlice } from '@reduxjs/toolkit'


const initialState = null

const allStudentData = createSlice({
  name: 'studentData',
  initialState,
  reducers: {
    studentsDataReducer : (state, action) => action.payload
  },
})

export const { studentsDataReducer } = allStudentData.actions
export default allStudentData.reducer