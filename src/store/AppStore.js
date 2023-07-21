import { configureStore } from '@reduxjs/toolkit'
import currentUser from './slice/currentUser'
 import allStudentsData from './slice/allStudentsData'
import schoolInfo from './slice/schoolInfo'
import currentClass from './slice/currentClass'



export const store = configureStore({
    reducer: {
      user: currentUser,
      students: allStudentsData,
      schoolInfo: schoolInfo,
      selectedClass: currentClass
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})