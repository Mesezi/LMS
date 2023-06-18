import { useState, useEffect } from "react"
import { database } from '../../../fireBaseConfig';
import { getDoc, doc, collection } from 'firebase/firestore';
import { useSelector } from "react-redux";

const AddClasses = () => {
    const [subjects, setSubjects] = useState()
    const [newClassDetails, setNewClassDetails] = useState({level: null, subjects: []})
    const userDetails = useSelector(state=>state.user.userDetails)

useEffect(() => {
    
  const getSubjects =  async () =>{
  
    const docRef = doc(database, `SCHOOLS/${userDetails.school}`);
    
    // const docRef = doc(database, "SCHOOLS", "DEMO",  "STUDENTS", studentId);
    
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setSubjects(docSnap.data().subjects);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
          }


if(userDetails){{   
  getSubjects()
}}

}, [userDetails])



useEffect(()=>{

  if(newClassDetails.level && subjects){
      setNewClassDetails(prev=>({...prev, subjects: [] }))
  }

}, [newClassDetails.level])


    const handleInput = (e)=>{
        setNewClassDetails(prev=>({...prev,[e.target.name]: e.target.value }))
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

const addClass = (e)=>{
e.preventDefault()
console.log(newClassDetails)
}


  return (
    <div>
        {subjects && <form onSubmit={(e)=>addClass(e)} className="flex flex-col gap-4">
<div className='flex gap-3'>
<label htmlFor="">Level</label>
<select name="level" id=""  onChange={(e)=>handleInput(e)}>
    <option value={null} >--</option>
    <option value="primary">Primary</option>
    <option value="junior secondary">Junior Secondary</option>
    <option value="senior secondary">Senior Secondary</option>
</select>
</div>

<div className='flex gap-3'>
    <label htmlFor="">Class name</label>
    <input type="text" name="Class" onChange={(e)=>handleInput(e)}/>
</div>

<div className='flex gap-3'>
<label htmlFor="">Subjects</label>

<div>
{
    newClassDetails.level && subjects[newClassDetails.level].map(el => {
     return <div> <label htmlFor={el} >{el}</label>
        <input type="checkbox" id={el} checked={newClassDetails.subjects.includes(el)} 
        onClick={()=>handleSelectedSubject(el)}/> 
        </div>
      })
}
</div>
   
  

</div>

<div className='flex gap-3'>
    <label htmlFor="">Class Key</label>
    <input type="text" name="key" onChange={(e)=>handleInput(e)}/>
</div>

<button>
  submit
</button>

        </form>}
        
        
    </div>
  )
}

export default AddClasses