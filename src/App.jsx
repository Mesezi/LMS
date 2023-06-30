import { useEffect } from 'react'
import { authReducer } from './store/slice/currentUser'
import { useDispatch } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AdminLogin from './pages/Admin/Login'
import './App.css'
import { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth";

// ADMIN IMPORTS
import AdminLayout from './pages/Admin/Layout'
import AdminDashboard from './pages/Admin/Dashboard'
import RouteGuard from './components/RouteGuard'
import Landing from './pages/Landing/Landing'
import Students from './pages/Admin/Students'
import Classes from './pages/Admin/Classes'
import StudentProfile from './pages/Admin/StudentProfile'
import AddStudent from './pages/Admin/AddStudent'
import AddClasses from './pages/Admin/AddClasses'

//CLASS IMPORTS
import ClassLogin from './pages/Class/Login'
import ClassLayout from './pages/Class/Layout'
import ClassDashboard from './pages/Class/Dashboard'
import ClassStudentProfile from './pages/Class/StudentProfile'
import ClassStudents from './pages/Class/Students'

//STUDENT IMPORTS
import StudentLogin from './pages/Student/Login'
import StudentLayout from './pages/Student/Layout'
import StudentDashboard from './pages/Student/Dashboard'


function App() {

  const dispatch = useDispatch()
  const auth = getAuth();

// signs user out after brwoser tab or window is closed 
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


  // update user auth state any time auth changes
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
      path:'/class-login',
      element: <ClassLogin />,
    },

    {
      path:'/student-login',
      element: <StudentLogin />,
    },

    {
      path: "/add-student",
      element: <AddStudent />,
    },
// Admin Routes
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
    },
// Classes Routes
    {
      path:'/class',
      element: <RouteGuard><ClassLayout /></RouteGuard> ,
      children: [
        {
          path: "/class",
          element: <ClassDashboard />,
        },

        {
          path: "/class/students",
          element: <ClassStudents />,
        },

        {
          path: "/class/students/:id",
          element: <ClassStudentProfile />,
        },
        
      ],
    },
    //Student Routes
    {
      path:'/student',
      element: <RouteGuard><StudentLayout /></RouteGuard> ,
      children: [
        {
          path: "/student",
          element: <StudentDashboard />,
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
