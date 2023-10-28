import { useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';

import { useEffect, useState } from 'react';
import { database } from '../../../fireBaseConfig';
import { getDoc, doc, collection, getDocs, updateDoc, setDoc } from 'firebase/firestore';


const StudentProfile = () => {
  const {state} = useLocation()
  const params = useParams()
  const userDetails = useSelector(state=>state.user.userDetails)
  const schoolInfo = useSelector(state=>state.schoolInfo)
  const allStudentsData = useSelector(state=>state.students)


  const [profile, setProfile] = useState()
  const [grades, setGrades] = useState()
  const [allYears, setAllYears] = useState([]) // All result years in firestore 
  const [schoolYear, setSchoolYear] = useState() // currently selected year
  const [currentTerm, setCurrentTerm] = useState() // currently selected term
  const [edit, setEdit] = useState(true)


  // const fetchStudentInfo = async () =>{
  //   const docRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${profile.id}`);
  //   const docSnap = await getDoc(docRef);
  //   docSnap.exists() ? setProfile(docSnap.data()) : console.log('no such document')
  // }

  const fetchStudentGrades = async () =>{
    setGrades(null)
    const docRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${profile.id}/GRADES/${schoolYear}/${currentTerm}/RESULT`);
    const docSnap = await getDoc(docRef);
    docSnap.exists() ? setGrades(docSnap.data()) : console.log('no such document')
  }

  useEffect(() => {
    if(allStudentsData){
      let name = params.id.split(' ')
      const currentStudent = allStudentsData.filter(student=> student['last name']=== name[1] && student['first name']=== name[0] )
      console.log(currentStudent[0])
      setProfile(currentStudent[0])
    }
  }, [allStudentsData])  
  
  useEffect(() => {
    if(profile){
      (async()=>{
        let yearArr=[]
        const yearsRef = collection(database, `SCHOOLS/${userDetails.school}/STUDENTS/${profile.id}/GRADES`)
        const gradeYear = await getDocs(yearsRef)
        gradeYear.forEach(year=> yearArr.push(year.id))
        setAllYears(yearArr)
      })()
    }
  }, [profile])


  useEffect(() => {
    if(schoolInfo){
      setSchoolYear(schoolInfo.session.year)
      setCurrentTerm(schoolInfo.session.term)
    }
  }, [schoolInfo])


// keep track of currently selected year or term and update grades state accordingly
  useEffect(()=>{
if(schoolYear && currentTerm){ 
 fetchStudentGrades();
}
  }, [schoolYear, currentTerm])

  const updateDetails = (subject, type, value) =>{

    value = Number(value)

    if(value > schoolInfo.grading[type.includes('test') ? 'test' : 'exam'] ){
      return alert(`${type.includes('test') ? 'test' : 'exam'} score can not be higher than 
      ${schoolInfo.grading[type.includes('test') ? 'test' : 'exam'] }`) 
    }

    setGrades(prev=>({...prev, [subject]: {...prev[subject] ,[type]: value } }))
  }

  const calculateAverage = () =>{

  const subjects = Object.keys(grades)
  let totalGrade = 0

  subjects.forEach(sub=>{
    totalGrade += grades[sub]['exam'] + grades[sub]['test 1']  + grades[sub]['test 2'] 
  })

  return (totalGrade / subjects.length)

  }

  const saveNewScores = async () =>{
    const average = calculateAverage()// calculate term average

    const studentRef = doc(database, `SCHOOLS/${userDetails.school}/CLASSES/${profile['student class']}/${schoolYear}/${currentTerm}`);
    const studentSnap = await getDoc(studentRef);

    const resultRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${profile.id}/GRADES/${schoolYear}/${currentTerm}/RESULT`);
    const otherRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${profile.id}/GRADES/${schoolYear}/${currentTerm}/OTHERS`);

    try{
   studentSnap.exists() ?  // update class doc with new average
   await updateDoc(studentRef, {
     [`${profile['first name']} ${profile['last name']}`]:{average}
   })
 : // if student averages does not exist on firestore, create and set its value in class doc
   await setDoc(studentRef, {
     [`${profile['first name']} ${profile['last name']}`]:{average}
   })

      await updateDoc(resultRef, grades); // set student grades in student doc
      await updateDoc(otherRef, {average}); // set student average in student doc
      setEdit(true)
    }
    catch(err){
      console.log(err)
    }
  }


  return (
    <div>
      { profile && 
      <section className='space-y-2'>
          
          <article>
            <h4 className='text-2xl text-center font-bold'>Student Info</h4>
            {
          Object.keys(profile).map(key=>{
            if(key.includes('latest')){
              return 
            }
            return <div className='flex gap-2'>
        <p>{key}</p>
        <span>{profile[key]}</span>
      </div>
          } 
      )
          }
          </article>

    <article>
      <h4 className='text-2xl text-center font-bold'>Attendance</h4>
    </article>

   


    <article>
      <h4 className='text-2xl text-center font-bold'>Grades</h4>
      <div className='flex justify-end gap-3'>
      <label htmlFor="">Term:
        <select name="" id="" onChange={(e)=>setCurrentTerm(e.target.value)}>
          <option selected={currentTerm === '1st'} value="1st">1st</option>
          <option selected={currentTerm === '2nd'} value="2nd">2nd</option>
          <option selected={currentTerm === '3rd'} value="3rd">3rd</option>
        </select>
      </label>

      <label htmlFor="">Year:
        <select name="" id="" onChange={(e)=>setSchoolYear(e.target.value)}>
          {
            allYears.map(year=> <option onClick={()=>setSchoolYear(year)} selected={schoolYear === year} value={year}>{year}</option>)
          }
        </select>
      </label>
    </div>

    {!edit ?<button className='w-20 bg-gray-400 p-2 rounded-md' onClick={()=> {
     fetchStudentGrades()
     setEdit(true) 
    }}>Reset</button>:
     <button className='w-20 bg-gray-400 p-2 rounded-md' onClick={()=> setEdit(false)}>edit</button>
    
    }

      <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2">Subject</th>
            <th className="p-2">Test 1</th>
            <th className="p-2">Test 2</th>
            <th className="p-2">Exam</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {grades && Object.entries(grades).map(([subject, data]) => (
            <tr key={subject}>
              <td className="border p-2">{subject}</td>
              <td className="border p-2"><input disabled={edit} max={20} className='w-10' type="text" name="" id="" value={data['test 1']}
               onChange={(e)=>updateDetails(subject, 'test 1', e.target.value)}/> </td>

              <td className="border p-2"><input disabled={edit} className='w-10' type="text" name="" id="" value={data['test 2']}
               onChange={(e)=>updateDetails(subject, 'test 2', e.target.value)}/> </td>

              <td className="border p-2"><input disabled={edit} className='w-10' type="text" name="" id="" value={data['exam']} 
              onChange={(e)=>updateDetails(subject, 'exam', e.target.value)}/> </td>

              <td className="border p-2">{ data['exam'] + data['test 1'] + data['test 2'] } </td>
            </tr>
          ))}
        </tbody>
      </table>
     { !edit && <button className='w-20 bg-gray-400 p-2 rounded-md' onClick={saveNewScores}>Save</button> }
    </div>
    </article>
          
        </section>
}
    </div>
  )
}

export default StudentProfile