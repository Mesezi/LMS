import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth' 
import { getDocs, query, collection, where } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux'
import { detailsReducer } from '../../store/slice/currentUser';
import { studentsDataReducer } from '../../store/slice/allStudentsData';
import { database } from '../../../fireBaseConfig';

const Layout = () => {
  const userDetails = useSelector((state)=> state.user.userDetails)
  const authDetails = useSelector((state)=> state.user.authDetails)
  let navigate = useNavigate()
  const dispatch = useDispatch()

   // if user is not class account navigate to landing page
   if(userDetails){
    if(userDetails.type !== "class"){
      navigate('/')
    }
  }


  useEffect(()=>{
  // split displayName and get school name and account type
    if(authDetails.displayName){
      const split = authDetails.displayName.split('-') 

      dispatch(detailsReducer({
        className: sessionStorage.getItem('class'),
        school: split[0],
        type: split[1]
      }))
    }

  }, [authDetails])

  useEffect(() => {
  dispatch(studentsDataReducer(null)) // clear student state

    const getAllStudents =  async () =>{
      const q = query(collection(database, `SCHOOLS/${userDetails.school}/STUDENTS`), where("student class", "==", userDetails.className));

      const querySnapshot = await getDocs(q);
      const students = []
     
      
      querySnapshot.forEach((doc) => {
        students.push({...doc.data(),id: doc.id})
        });
        
        dispatch(studentsDataReducer(students))

        console.log(students)
    }


if(userDetails){{   
  getAllStudents()
  console.log(userDetails)
  }}
  
}, [userDetails])


  const logOut = () =>{
    signOut(authDetails.auth).then(()=> navigate('/class-login')).finally(sessionStorage.clear())
  }

  return (
    <main className='flex'>
      <aside className='h-screen fixed translate-x-[-100%] lg:translate-x-0 w-[18%] bg-blue-500 p-5 flex flex-col gap-4'>
        <h3>LMS</h3>
        <ul className='flex flex-col gap-2'>
          <li className='p-3 rounded-md '><NavLink>Dashboard</NavLink> </li>
          <li className='p-3 rounded-md '><a target='_blank' href='/add-student'>Add Student</a> </li>
          <li className='p-3 rounded-md '><NavLink to={'/class/students'}>All Students</NavLink> </li>
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