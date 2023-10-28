import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth' 
import { useDispatch, useSelector } from 'react-redux'
import { detailsReducer } from '../../store/slice/currentUser';
import getCurrentDate from '../../utils/getCurrentDate';
import { doc, getDoc, getDocs, updateDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../../../fireBaseConfig';
import { infoReducer } from '../../store/slice/schoolInfo';
import sortClasses from '../../utils/sortClasses';
import { studentsDataReducer } from '../../store/slice/allStudentsData';

const Layout = () => {

  const userDetails = useSelector((state)=> state.user.userDetails)
  const authDetails = useSelector((state)=> state.user.authDetails)
  const schoolInfo = useSelector(state=>state.schoolInfo)
  const [numberOfNewMessages, setNumberOfNewMessages] = useState(0);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [termDaysLeft, setTermDaysLeft] = useState('')
  const [studentSubjects, setStudentSubjects] = useState()
  


  // if user is not admin navigate to landing page
  if(userDetails){
    if(userDetails.type !== "student"){
      navigate('/')
    }
  }

  useEffect(()=>{

    
      if(authDetails.displayName){
        // split displayName and get school name and account type
        const split = authDetails.displayName.split('-') 
        const studentRef = doc(database, `SCHOOLS/${split[0]}/STUDENTS/${authDetails.email}`);
        const infoRef = doc(database, `SCHOOLS/${split[0]}`);
  
              // get student info from firestore
              onSnapshot(studentRef, (doc) => { // SNAPSHOT KEEPS TRACK OF ANY CHANGES IN FIRESTORE
                dispatch(detailsReducer({
                  ...doc.data(),
                  school: split[0],
                  type: split[1]
                }))
            });

              // get student info from firestore
               onSnapshot(infoRef, (doc) => { // SNAPSHOT KEEPS TRACK OF ANY CHANGES IN FIRESTORE
                dispatch((infoReducer(doc.data())))
            });
              
      }
  
    }, [authDetails])





    useEffect(()=>{

      if(userDetails){
      const classRef = doc(database, `SCHOOLS/${userDetails.school}/CLASSES/${userDetails['student class']}`);
       // get student class subjects
       onSnapshot(classRef, (doc) => { // SNAPSHOT KEEPS TRACK OF ANY CHANGES IN FIRESTORE
        setStudentSubjects(doc.data().subjects)
    });
      
    }
    }, [userDetails])


    useEffect(()=>{
// number of new messages from db
      if(userDetails?.latestNoticeId && schoolInfo){
          let count = 0
          Object.keys(schoolInfo.notices).forEach(key =>{
              // console.log(userDetails.latestNoticeId.includes(key), key)
              if(!userDetails.latestNoticeId.includes(key)){
                  count++
              }
          })
        setNumberOfNewMessages(count)

        // remove id's from user document that don't exist in schools notice anymore i.e notice was deleted on admin side
        const schoolNoticeId = Object.keys(schoolInfo.notices)
        const newIds = userDetails.latestNoticeId.filter(id=>schoolNoticeId.includes(id))
    
     const docRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${userDetails.email}`);
        updateDoc(docRef, {
         latestNoticeId: [...newIds]
     });
     }
    }, [userDetails, schoolInfo])






  useEffect(()=>{

    if(schoolInfo){
       var today = new Date(getCurrentDate());
    var termEnd = new Date(schoolInfo.session['end date']);
      
    // To calculate the time difference of two dates
    var Difference_In_Time = termEnd.getTime() - today.getTime();
      
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    setTermDaysLeft(Difference_In_Days)
    }
   

  }, [schoolInfo])




  const logOut = () =>{
    signOut(authDetails.auth).then(()=> navigate('/student-login')).finally(sessionStorage.clear())
  }

  return (
    <>
    {
     userDetails?.type === 'student' && <main className='flex'>
      <aside className='h-screen fixed translate-x-[-100%] lg:translate-x-0 w-[18%] bg-blue-500 p-5 flex flex-col gap-4'>
        <h3>LMS</h3>
        <ul className='flex flex-col gap-2'>
          <li className='p-3 rounded-md '><NavLink>Dashboard</NavLink> </li>
          <li className='p-3 rounded-md '><NavLink>School info</NavLink> </li>
          <li className='p-3 rounded-md '><NavLink>Timetable</NavLink> </li>
          <li className='p-3 rounded-md '><NavLink to='/student/profile'>Profile</NavLink> </li>

          <li className='p-3 rounded-md ' onClick={logOut}>Log out</li>
        </ul>
      </aside>

      <section className='lg:ml-[18%] w-full min-h-screen'>
       {schoolInfo && 
       <p className='p-2 bg-gray-300 text-sm'>
        {`${schoolInfo.session.term} term of the ${schoolInfo.session.year} session ends ${new Date(schoolInfo.session.endDate)}`}</p>}
       { numberOfNewMessages > 0 && <p>{`You have ${numberOfNewMessages} new message(s)`}</p>}
      <Outlet context={[studentSubjects]}  />
      </section>
       
    </main>
    }
    </>
    
  )
}

export default Layout