import { useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminLogin from './pages/Admin/Login'
import './App.css'
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";
import AdminLayout from './pages/Admin/Layout'
import AdminDashboard from './pages/Admin/Dashboard'
import RouteGuard from './components/RouteGuard'
import { authReducer } from './store/slice/currentUser'
import { useDispatch } from 'react-redux'
import Landing from './pages/Landing/Landing'
import Students from './pages/Admin/Students'
import Classes from './pages/Admin/Classes'
import StudentProfile from './pages/Admin/StudentProfile'
import AddStudent from './pages/Admin/AddStudent'
import AddClasses from './pages/Admin/AddClasses'


function App() {

  const dispatch = useDispatch()
  const auth = getAuth();


setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    
  });

  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user=>{
       dispatch(authReducer(user))
       })
       return unsubscribe
   }, [])

  
  const router = createBrowserRouter([
    {
      path:'/',
      element: <Landing />,
    },

    {
      path:'/admin-login',
      element: <AdminLogin />,
    },
    {
      path: "/add-student",
      element: <AddStudent />,
    },

    {
      path:'/admin',
      element: <RouteGuard><AdminLayout /></RouteGuard> ,
      children: [
        {
          path: "/admin",
          element: <AdminDashboard />,
        },
        {
          path: "/admin/students",
          element: <Students />,
        },
        {
          path: "/admin/students/:id",
          element: <StudentProfile />,
        },

        {
          path: "/admin/classes/add",
          element: <AddClasses />,
        },
        
        {
          path: "/admin/classes",
          element: <Classes />,
        },
        {
          path: "/admin/notice-board",
          element: <AdminDashboard />,
        },
      ],
    }
      ])


  return (
    <>
     <RouterProvider router={router}/>
    </>
  )
}

export default App
