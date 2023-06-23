import { useState, useEffect } from "react"
import { database } from '../../../fireBaseConfig';
import { getDoc, doc, collection, setDoc, getDocs } from 'firebase/firestore';
import { useSelector } from "react-redux";
import bcrypt from 'bcryptjs'

const AddClasses = () => {
    const [subjects, setSubjects] = useState()
    const [currentlyRegClasses, setCurrentlyRegClasses] = useState()
    const [newClassDetails, setNewClassDetails] = useState({level: null, subjects: [], number:1, alm:''})
    const userDetails = useSelector(state=>state.user.userDetails)

useEffect(() => {
    
  const getData =  async () =>{

     const querySnapshot = await getDocs(collection(database, `SCHOOLS/${userDetails.school}/CLASSES`));
     const classes = [] 
     querySnapshot.forEach((doc) => classes.push(doc.id));
     setCurrentlyRegClasses(classes)


  
    const docRef = doc(database, `SCHOOLS/${userDetails.school}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      setSubjects(docSnap.data().subjects);
      console.log("document!");
    } else {console.log("No such document!");}



    
          }


if(userDetails){{   
  getData()
}}


}, [userDetails])



useEffect(()=>{

  if(newClassDetails.level && subjects){
      setNewClassDetails(prev=>({...prev, subjects: [] }))
  }
}, [newClassDetails.level])


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
console.log(currentlyRegClasses)

const addClass =  async (e) =>{

  e.preventDefault()

  const salt = bcrypt.genSaltSync(10)

  const hashedPassword = bcrypt.hashSync(newClassDetails.key, salt)

  const docRef = doc(database, `SCHOOLS/${userDetails.school}/CLASSES/${newClassDetails.level} ${newClassDetails.number}${newClassDetails.alm}`);
  
  // const docRef = doc(database, "SCHOOLS", "DEMO",  "STUDENTS", studentId);

  if(currentlyRegClasses.includes(`${newClassDetails.level} ${newClassDetails.number}${newClassDetails.alm}`)){
    alert('class already registered')
  }

  else{
    try{ await setDoc(docRef, {...newClassDetails, key:hashedPassword}); }

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
<label htmlFor="">Level</label>
<select name="level" id=""  onChange={(e)=>handleInput(e)} required>
    <option value={null} >--</option>
    <option value="primary">Primary</option>
    <option value="junior secondary">Junior Secondary</option>
    <option value="senior secondary">Senior Secondary</option>
</select>
</div>



{newClassDetails.level && <> 
<div className='flex gap-3'>
<label htmlFor="">Class Number</label>
 <select name="number" id="" onChange={(e)=>handleInput(e)} required>
    <option value={1}>1</option>
    <option value={2}>2</option>
    <option value={3}>3</option>
  {/* display extra classes if level is primary school */}
    {newClassDetails.level === 'primary' && <>
    <option value={4}>4</option>
    <option value={5}>5</option>
    <option value={6}>6</option></>}
</select> 
</div>

<div className='flex gap-3'>
    <label htmlFor="">Class name</label>
    <p>{`${newClassDetails.level} ${newClassDetails.number}${newClassDetails.alm}`}</p>
</div>

<div className='flex gap-3'>
<label htmlFor="">Subjects</label>
  {/* dropdown list of registered classes */}
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
    <input type="text" name="key" onChange={(e)=>handleInput(e)} required/>
</div>

<div className='flex gap-3'>
    <label htmlFor="">Alm</label>
    <input type="text" name="alm" onChange={(e)=>handleInput(e)}/>
</div>
</>}

<button>
  submit
</button>

        </form>}
        
        
    </div>
  )
}

export default AddClasses