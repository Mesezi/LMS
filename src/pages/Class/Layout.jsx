import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth' 
import { getDocs, getDoc, query, collection, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux'
import { detailsReducer } from '../../store/slice/currentUser';
import { studentsDataReducer } from '../../store/slice/allStudentsData';
import { database } from '../../../fireBaseConfig';
import { infoReducer } from '../../store/slice/schoolInfo';

const Layout = () => {
  const userDetails = useSelector((state)=> state.user.userDetails)
  const authDetails = useSelector((state)=> state.user.authDetails)
  const schoolInfo = useSelector(state=>state.schoolInfo)
  const [numberOfNewMessages, setNumberOfNewMessages] = useState(0);
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

            // get class info from firestore
            const docRef = doc(database, `SCHOOLS/${split[0]}/CLASSES/${sessionStorage.getItem('class')}`);
            onSnapshot(docRef, (doc) => { // SNAPSHOT KEEPS TRACK OF ANY CHANGES IN FIRESTORE
              dispatch(detailsReducer({
                ...doc.data(),
                className: sessionStorage.getItem('class'),
                school: split[0],
                type: split[1]
              }))
          });
            
    }

  }, [authDetails])

  useEffect(() => {
  dispatch(studentsDataReducer(null)) // clear student state

    const getData =  async () =>{
      const q = query(collection(database, `SCHOOLS/${userDetails.school}/STUDENTS`), where("student class", "==", userDetails.className));


      // get all class students
      const querySnapshot = await getDocs(q);
      const students = []
      querySnapshot.forEach((doc) => {
        students.push({...doc.data(),id: doc.id})
        });
        dispatch(studentsDataReducer(students))


         // get school info from firestore
      const docRef = doc(database, `SCHOOLS/${userDetails.school}`);
      getDoc(docRef).then(docSnap=> {

        if (docSnap.exists()) {
          dispatch(infoReducer(docSnap.data()));
        } else { console.log("No such document!"); }
      }); 

    }


  if(userDetails){{  
    onSnapshot(doc(database, "SCHOOLS", userDetails.school), (doc) => { // keep track of any change in firestore and update user state
    getData()
  })
  }}
  
}, [userDetails])


useEffect(()=>{
  // number of new messages from db
        if(userDetails && schoolInfo){
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
          // console.log(schoolNoticeId)
       const newIds = userDetails.latestNoticeId.filter(id=>schoolNoticeId.includes(id))
      
       const docRef = doc(database, `SCHOOLS/${userDetails.school}/CLASSES/${userDetails.className}`);
          updateDoc(docRef, {
           latestNoticeId: [...newIds]
       });
       }
      }, [userDetails, schoolInfo])


  const logOut = () =>{
    signOut(authDetails.auth).then(()=> navigate('/class-login')).finally(sessionStorage.clear())
  }

  return (
    <>
    {
     userDetails?.type === 'class' && <main className='flex'>
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
     {schoolInfo && 
       <p className='p-2 bg-gray-300 text-sm'>
        {`${schoolInfo.session.term} term of the ${schoolInfo.session.year} session ends ${new Date(schoolInfo.session['end date'])}`}</p>}
       { numberOfNewMessages > 0 && <p>{`You have ${numberOfNewMessages} new message(s)`}</p>}
     <Outlet />
     </section>
      
   </main>}</>
    
  )
}

export default Layout