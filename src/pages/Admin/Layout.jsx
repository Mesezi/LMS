import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth' 
import { useDispatch, useSelector } from 'react-redux'
import { detailsReducer } from '../../store/slice/currentUser';

const Layout = () => {

  const userDetails = useSelector((state)=> state.user.userDetails)
  const authDetails = useSelector((state)=> state.user.authDetails)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  // if user is not admin navigate to landing page
  if(userDetails){
    if(userDetails.type !== "admin"){
      navigate('/')
    }
  }

  useEffect(()=>{
  // split displayName and get school name and account type
    if(authDetails.displayName){
      const split = authDetails.displayName.split('-') 

      dispatch(detailsReducer({
        school: split[0],
        type: split[1]
      }))
    }

  }, [authDetails])


  const logOut = () =>{
    signOut(authDetails.auth).then(()=> navigate('/admin-login')).finally(sessionStorage.clear())
  }

  return (
    <main className='flex'>
      <aside className='h-screen fixed translate-x-[-100%] lg:translate-x-0 w-[18%] bg-blue-500 p-5 flex flex-col gap-4'>
        <h3>LMS</h3>
        <ul className='flex flex-col gap-2'>
          <li className='p-3 rounded-md '><NavLink>Dashboard</NavLink> </li>
          <li className='p-3 rounded-md '><NavLink>All Classes</NavLink> </li>
          <li className='p-3 rounded-md '><NavLink to={'/admin/classes/add'}>Add Class</NavLink> </li>
          <li className='p-3 rounded-md '><a target='_blank' href='/add-student'>Add Student</a> </li>
          <li className='p-3 rounded-md '><NavLink to={'/admin/students'}>All Students</NavLink> </li>
          <li className='p-3 rounded-md '><NavLink>School info</NavLink> </li>
          <li className='p-3 rounded-md '><NavLink>Timetable</NavLink> </li>
          <li className='p-3 rounded-md '><NavLink>Notice Board</NavLink> </li>

          <li className='p-3 rounded-md ' onClick={logOut}>Log out</li>
        </ul>
      </aside>

      <section className='lg:ml-[18%] w-full min-h-screen'>
      <Outlet />
      </section>
       
    </main>
  )
}

export default Layout