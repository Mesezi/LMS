import { useState, useEffect } from "react"
import { database } from '../../../fireBaseConfig';
import { getDoc, doc, collection, setDoc, getDocs } from 'firebase/firestore';
import { useSelector } from "react-redux";
import bcrypt from 'bcryptjs'
import sortClasses from "../../utils/sortClasses";
import { useOutletContext } from "react-router-dom";

const AddClasses = () => {
    const [newClassDetails, setNewClassDetails] = useState({subjects: [], alm:''})
    const userDetails = useSelector(state=>state.user.userDetails)
    const [currentlyRegClasses] = useOutletContext()
    const subjects = useSelector(state=>state.schoolInfo.subjects)

useEffect(()=>{

setNewClassDetails(prev=>({...prev, subjects: [] }))
  
}, [newClassDetails['class name']])


  const handleInput = (e)=>{
      setNewClassDetails(prev=>({...prev,[e.target.name]: e.target.value.trim() }))
  }

 const handleSelectedSubject = (subj) =>{
   const selected =  newClassDetails.subjects
   if(selected.includes(subj)){
    selected.splice(selected.indexOf(subj), 1)
   }
   else{
    selected.push(subj)
   }

  setNewClassDetails(prev=> ({...prev, subjects:selected}))
 }


//  console.log(bcrypt.compareSync('pry6key', '$2a$10$kgIlUj5lf1xsOV9LabpRA.oQVkTos3/BQGWVIR1NcTMtK1mkfwuSe'))

const addClass =  async (e) =>{

  e.preventDefault()
  const salt = bcrypt.genSaltSync(10)

  const hashedPassword = bcrypt.hashSync(newClassDetails.key, salt)

  const docRef = newClassDetails.alm ?  doc(database, `SCHOOLS/${userDetails.school}/CLASSES/${newClassDetails['class name']}-${newClassDetails.alm}`) :
   doc(database, `SCHOOLS/${userDetails.school}/CLASSES/${newClassDetails['class name']}`) 
  
  // const docRef = doc(database, "SCHOOLS", "DEMO",  "STUDENTS", studentId);

  if(currentlyRegClasses.includes(`${newClassDetails['class name']}`)){
    alert('class already registered')
  }

  else{
    try{ 
      await setDoc(docRef, {...newClassDetails, key:hashedPassword}); }

    catch (err){ console.log(err)}  
  }

  



      }

  return (
     
    <div>
      {/* list of registered classes */}
      {currentlyRegClasses && <ul className="mb-20">
        {currentlyRegClasses.map(el=><li>{el}</li>)}
        
        </ul>}
      {subjects &&
<form onSubmit={(e)=>addClass(e)} className="flex flex-col gap-4">

<div className='flex gap-3'>
<label htmlFor="">Class</label>
<select name="class name" id=""  onChange={(e)=>handleInput(e)} required>
    <option value={null} >--</option>
    <option value="Primary 1">Primary 1</option>
    <option value="Primary 2">Primary 2</option>
    <option value="Primary 3">Primary 3</option>
    <option value="Primary 4">Primary 4</option>
    <option value="Primary 5">Primary 5</option>
    <option value="Primary 6">Primary 6</option>

    <option value="JS 1">Junior Secondary 1</option>
    <option value="JS 2">Junior Secondary 2</option>
    <option value="JS 3">Junior Secondary 3</option>


    <option value="SS 1">Senior Secondary 1</option>
    <option value="SS 2">Senior Secondary 2</option>
    <option value="SS 3">Senior Secondary 3</option>
</select>
</div>




{newClassDetails['class name'] && <> 

<div className='flex gap-3'>
<label htmlFor="">Subjects</label>
  {/* dropdown list of registered classes */}
<div>
  {
 newClassDetails['class name'].includes('Primary') && subjects['primary'].map(el => {
   return <div> <label htmlFor={el} >{el}</label>
      <input type="checkbox" id={el} checked={newClassDetails.subjects.includes(el)} 
      onClick={()=>handleSelectedSubject(el)}/> 
      </div>
    })
  }


{
 newClassDetails['class name'].includes('JS') && subjects['junior secondary'].map(el => {
   return <div> <label htmlFor={el} >{el}</label>
      <input type="checkbox" id={el} checked={newClassDetails.subjects.includes(el)} 
      onClick={()=>handleSelectedSubject(el)}/> 
      </div>
    })
  }

{
 newClassDetails['class name'].includes('SS') && subjects['senior secondary'].map(el => {
   return <div> <label htmlFor={el} >{el}</label>
      <input type="checkbox" id={el} checked={newClassDetails.subjects.includes(el)} 
      onClick={()=>handleSelectedSubject(el)}/> 
      </div>
    })
  }

 

</div>
   
  

</div>

<div className='flex gap-3'>
    <label htmlFor="">Alm</label>
    <input type="text" name="alm" onChange={(e)=>handleInput(e)} autoComplete="off"/>
</div>

<div className='flex gap-3'>
    <label htmlFor="">Class Key</label>
    <input type="text" name="key" onChange={(e)=>handleInput(e)} required autoComplete="off"/>
</div>


{/* <div className='flex gap-3'>
    <label htmlFor="">date</label>
    <input type="date" name="date" onChange={(e)=>console.log(e.target.value)}/>
</div> */}
</>}

<button>
  submit
</button>

        </form>}
        
        
    </div>
  )
}

export default AddClasses