import { useEffect, useState } from 'react';
import StudentBar from '../../components/StudentBar';
import { useDispatch, useSelector } from 'react-redux'
import { studentsDataReducer } from '../../store/slice/allStudentsData';
import { database } from '../../../fireBaseConfig';
import { getDocs, collection, query, where } from 'firebase/firestore';

const Students = () => {
const studentData = useSelector(state=>state.students)
const userDetails = useSelector(state=>state.user.userDetails)
const authDetails = useSelector(state=>state.user.authDetails)
const students = useSelector(state=>state.students)
const dispatch = useDispatch()




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