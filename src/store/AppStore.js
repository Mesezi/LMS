import { configureStore } from '@reduxjs/toolkit'
import currentUser from './slice/currentUser'
 import allStudentsData from './slice/allStudentsData'
import schoolInfo from './slice/schoolInfo'



export const store = configureStore({
    reducer: {
      user: currentUser,
      students: allStudentsData,
      schoolInfo: schoolInfo
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})