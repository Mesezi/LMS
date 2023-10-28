import {useEffect, useState} from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { database } from '../../../fireBaseConfig'
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'

const ClassSubject = () => {
    const params = useParams()
    const allStudentsData = useSelector(state=>state.students)
    const userDetails = useSelector(state=>state.user.userDetails)
    const schoolInfo = useSelector(state=>state.schoolInfo)
    const [subjectGrades, setSubjectGrades] = useState() // state to store students taking this subject and their grades
    const [edit, setEdit] = useState(false)

  useEffect(()=>{
    
    if(allStudentsData && schoolInfo){
        (async()=>{
            const subjectResult = []
            const {year, term} = schoolInfo.session
            const students = allStudentsData.filter(student=> student['student class'] === params.class) // filter students in class

            const requests = students.map(student=>getDoc(doc(database
                , `SCHOOLS/${userDetails.school}/STUDENTS/${student.id}/GRADES/${year}/${term}/RESULT`))) // create requests to get each student result
    
            
            let response = await Promise.all([...requests]) // Promise.all completes after all requests have been made 

            // using the response store student name, id and grades accordingly in state
            response.forEach((item, index)=>{
                subjectResult.push({
                name: `${students[index]['first name']} ${students[index]['last name']}`,
                 id:students[index].id,
                 grade: item.data()
                
                })
            })

            setSubjectGrades(subjectResult)
        })()
       
      }


  }, [allStudentsData, schoolInfo])  


  const updateDetails = (id, type, value) =>{

    value = Number(value)

    if(value > schoolInfo.grading[type.includes('test') ? 'test' : 'exam'] ){
      return alert(`${type.includes('test') ? 'test' : 'exam'} score can not be higher than 
      ${schoolInfo.grading[type.includes('test') ? 'test' : 'exam'] }`) 
      
    }
    const updatedGrades = [...subjectGrades]

    updatedGrades.forEach(item =>{
        if(item.id === id){
            item.grade[`${params.subject}`][type] = value
        }
    })
    setSubjectGrades(updatedGrades)
  }

  const calculateAverage = (grades) =>{
  const subjects = Object.keys(grades)
  let totalGrade = 0
  subjects.forEach(sub=>{
    totalGrade += grades[sub]['exam'] + grades[sub]['test 1']  + grades[sub]['test 2'] 
  })

  return (totalGrade / subjects.length)

  }


  const saveNewScores = async () =>{
    const {year, term} = schoolInfo.session

    // you dey wear facemask?? 

    // basically we are creating an array of promises or requests to update each student grades and where average is stored in firebase

    const updateRequests = subjectGrades.map(item=>{
        return (async  () =>{
            const average = calculateAverage(item.grade)

            const classRef = doc(database, `SCHOOLS/${userDetails.school}/CLASSES/${params.class}/${year}/${term}`);
            const classSnap = await getDoc(classRef);

            const resultRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${item.id}/GRADES/${year}/${term}/RESULT`);
           const otherRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${item.id}/GRADES/${year}/${term}/OTHERS`);

           try{
            classSnap.exists() ?  // update class doc with new average
            await updateDoc(classRef, {
              [`${item.name}`]:{average}
            })
          : // if student averages does not exist on firestore, create and set its value in class doc
            await setDoc(classRef, {
                [`${item.name}`]:{average}
            })
         
               await updateDoc(resultRef, item.grade); // set student grades in student doc
               await updateDoc(otherRef, {average}); // set student average in student doc
               setEdit(true)

               return 'done'
             }
             catch(err){
               console.log(err)
             }
           
        })() // this is an immediately invoked function (IIFE) thats why the async function is wrapped in parantheses and invoked immediately
    

    })
     await Promise.all([...updateRequests]) // Promise.all once again will ensure all requests are completed 
 
    alert('done') // alert admin that changes are done
  }

  return (
    <main>

<section>
<h3>Subject Details</h3>
</section>


<section>
<h3>Students</h3>
{!edit ?<button className='w-20 bg-gray-400 p-2 rounded-md' onClick={()=> {
     setEdit(true) 
    }}>Reset</button>:
     <button className='w-20 bg-gray-400 p-2 rounded-md' onClick={()=> setEdit(false)}>edit</button>
    
    }
<table className="w-full">
        <thead>
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Test 1</th>
            <th className="p-2">Test 2</th>
            <th className="p-2">Exam</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {subjectGrades?.map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2"><input disabled={edit} max={20} className='w-10'
               type="text" name="" id="" value={item.grade[`${params.subject}`]['test 1']}
               onChange={(e)=>updateDetails(item.id, 'test 1', e.target.value)}/> </td>

              <td className="border p-2"><input disabled={edit} className='w-10' type="text" 
              name="" id="" value={item.grade[`${params.subject}`]['test 2']}
               onChange={(e)=>updateDetails(item.id, 'test 2', e.target.value)}/> </td>

              <td className="border p-2"><input disabled={edit} className='w-10' type="text" 
              name="" id="" value={item.grade[`${params.subject}`]['exam']} 
              onChange={(e)=>updateDetails(item.id, 'exam', e.target.value)}/> </td>

              <td className="border p-2">{ item.grade[`${params.subject}`]['exam'] + item.grade[`${params.subject}`]['test 1'] + item.grade[`${params.subject}`]['test 2'] } </td>
            </tr>
          ))}
        </tbody>
      </table>
      { !edit && <button className='w-20 bg-gray-400 p-2 rounded-md' onClick={saveNewScores}>Save</button> }
</section>

    </main>
  )
}

export default ClassSubject