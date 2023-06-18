import { useEffect, useState } from 'react';
import StudentBar from '../../components/StudentBar';
import { useDispatch, useSelector } from 'react-redux'
import { studentsDataReducer } from '../../store/slice/allStudentsData';
import { database } from '../../../fireBaseConfig';
import { getDocs, collection } from 'firebase/firestore';

const Students = () => {
const studentData = useSelector(state=>state.students)
const userDetails = useSelector(state=>state.user.userDetails)
const dispatch = useDispatch()


useEffect(() => {
    
  if(userDetails){{
    const getAllStudents =  async () =>{
      const querySnapshot = await getDocs(collection(database, `SCHOOLS/${userDetails.school}/STUDENTS`));
    
    
    
     const students = [] 
     querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
    
      students.push({...doc.data(),
        id: doc.id})
      });
      
      dispatch(studentsDataReducer(students))
        }
      
        getAllStudents()
  }}
  
  
}, [userDetails])

console.log(studentData)

  return (
  <section>

{
!studentData ? <p>loading...</p> : 
<div className='flex flex-col gap-3'>{
  studentData?.map(student=>{
  return <StudentBar {...student} />
  })
  }</div>

}



  </section> 
  )
}

export default Students