import { useEffect, useState } from 'react';
import { database } from '../../../fireBaseConfig';
import { getDoc, doc, collection, getDocs, updateDoc, setDoc } from 'firebase/firestore';
import { useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';

const StudentProfile = () => {
  const userDetails = useSelector(state=>state.user.userDetails)
  const schoolInfo = useSelector(state=>state.schoolInfo)

  const [profile, setProfile] = useState()
  const [grades, setGrades] = useState()
  const [allYears, setAllYears] = useState([]) // All result years in firestore 
  const [schoolYear, setSchoolYear] = useState() // currently selected year
  const [currentTerm, setCurrentTerm] = useState() // currently selected term

  const fetchStudentGrades = async () =>{
    setGrades(null)
    const docRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${userDetails.email}/GRADES/${schoolYear}/${currentTerm}/RESULT`);
    const docSnap = await getDoc(docRef);

    docSnap.exists() ? setGrades(docSnap.data()) : console.log('no such document')
  }
 
  
  useEffect(() => {
    if(userDetails){
      (async()=>{
        let yearArr = []
        const yearsRef = collection(database, `SCHOOLS/${userDetails.school}/STUDENTS/${userDetails.id}/GRADES`)
        const gradeYear = await getDocs(yearsRef)
        gradeYear.forEach(year=> yearArr.push(year.id))
        setAllYears(yearArr)
      })()
    }
  }, [userDetails])


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



  console.log(grades)



  return (
    <>
      {/* { profile && Object.keys(profile).map(
        key=> <div className='flex gap-2'>
        <p>{key}</p>
        <span>{profile[key]}</span>
      </div>
      )
        
      } */}
      {
        userDetails && <section className='space-y-2'>
          
          <article>
            <h4 className='text-2xl text-center font-bold'>Student Info</h4>
            {
          Object.keys(userDetails).map(key=>{
            if(key.includes('latest')){
              return 
            }
            return <div className='flex gap-2'>
        <p>{key}</p>
        <span>{userDetails[key]}</span>
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
              <td className="border p-2">{data['test 1']}</td>

              <td className="border p-2">{data['test 2']} </td>

              <td className="border p-2">{data['exam']} </td>

              <td className="border p-2">{ data['exam'] + data['test 1'] + data['test 2'] } </td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
    </article>
          
        </section>
      }
    </>
  )
}

export default StudentProfile