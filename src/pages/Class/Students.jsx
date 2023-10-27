import { useEffect, useState } from 'react';
import StudentBar from '../../components/StudentBar';
import { useDispatch, useSelector } from 'react-redux'
import { studentsDataReducer } from '../../store/slice/allStudentsData';
import { database } from '../../../fireBaseConfig';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';

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
  return   <div>
  <Link
    to={`/class/students/${student["first name"]} ${student["last name"]}`}
    className='flex  flex-col gap-3 p-5 bg-slate-300'
  >
    <h3>{`${student["first name"]} ${student["last name"]}`}</h3>
    <p>{student.email}</p>
    <p>{student.gender}</p>
    <p>{student["student class"]}</p>
  </Link>
    </div>  
  })
  }</div>

}



  </section> 
  )
}

export default Students