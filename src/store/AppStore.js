import { configureStore } from '@reduxjs/toolkit'
import currentUser from './slice/currentUser'
 import allStudentsData from './slice/allStudentsData'



export const store = configureStore({
    reducer: {
      user: currentUser,
      students: allStudentsData
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})