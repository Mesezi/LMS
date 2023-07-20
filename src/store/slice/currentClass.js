import { createSlice } from '@reduxjs/toolkit'


const initialState = null

const selectedClass = createSlice({
    name: 'selectedClass',
    initialState,
    reducers: {
        setClass: (state, action) => action.payload
    }
})

export const {setClass} = selectedClass.actions
export default selectedClass.reducer