import { configureStore } from '@reduxjs/toolkit'
import currentUser from './slice/currentUser'
 import allStudentsData from './slice/allStudentsData'
import schoolInfo from './slice/schoolInfo'
import currentClass from './slice/currentClass'
import registeredClasses from './slice/registeredClasses'



export const store = configureStore({
    reducer: {
      user: currentUser,
      students: allStudentsData,
      schoolInfo: schoolInfo,
      selectedClass: currentClass,
      registeredClasses: registeredClasses
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})