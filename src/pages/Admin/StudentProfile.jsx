import { useEffect, useState } from 'react';
import { database } from '../../../fireBaseConfig';
import { getDoc, doc, collection } from 'firebase/firestore';
import { useLocation, useParams } from 'react-router-dom'

const StudentProfile = () => {
  const {state} = useLocation()
  const [profile, setProfile] = useState()
  const userDetails = useSelector(state=>state.user.userDetails)

  useEffect(() => {
  
const getAllStudents =  async () =>{

const docRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${state.email}`);

// const docRef = doc(database, "SCHOOLS", "DEMO",  "STUDENTS", studentId);

const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  setProfile(docSnap.data());
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}
      }


      if(userDetails){
        getAllStudents()
      }
    
      
    
  }, [])

 profile && console.log(Object.keys(profile))

  return (
    <div>
      { profile && Object.keys(profile).map(
        key=> <div className='flex gap-2'>
        <p>{key}</p>
        <span>{profile[key]}</span>
      </div>
      )
        
      }
    </div>
  )
}

export default StudentProfile