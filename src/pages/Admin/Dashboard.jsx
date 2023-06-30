import {useState} from 'react'
import { useSelector } from 'react-redux'
import { useOutletContext } from 'react-router-dom'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import getCurrentDate from '../../utils/getCurrentDate';
import { doc, updateDoc } from 'firebase/firestore';
import { database } from '../../../fireBaseConfig';


const Dashboard = () => {
const students = useSelector(state=>state.students)
const [currentlyRegClasses] = useOutletContext()
const [value, onChange] = useState(new Date());
const [noticeForm, setNoticeForm] = useState(new Date());
const schoolInfo = useSelector(state=>state.schoolInfo)
const userDetails = useSelector(state=>state.user.userDetails)

const datesToAddClassTo = [{date:'2023-6-27', event: 'party'}, {date:'2023-6-9', event: 'exam'}, {date:'2023-6-9', event: 'ends'}];

function isSameDay(a, b) {
  return a.getTime() - b.getTime() === 0
}


function tileClassName({ date, view }) {
  // Add class to tiles in month view only
  if (view === 'month') {
    // Check if a date React-Calendar wants to check is on the list of dates to add class to
    if (datesToAddClassTo.find(dDate => isSameDay(new Date (dDate.date), date))) {
      return 'circle';
    }
  }
}

const formatedDate = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`

const handleInput = (e)=>{
  setNoticeForm(prev=>({...prev,[e.target.name]: e.target.value.trim()}))
}

const submitNewNotice = async (e) =>{
  e.preventDefault()

  const id =new Date().getTime() // set new notice id with time
  const docRef = doc(database, `SCHOOLS/${userDetails.school}`);

  try{
    await updateDoc(docRef, {
      notices: {...schoolInfo.notices, [id]: {...noticeForm, timestamp:getCurrentDate()}}
  });
  }
  catch(err){
    console.log(err)
  }
}

const deleteNotice = async (id) =>{
 let updatedNotices = {...schoolInfo.notices}
 delete updatedNotices[id]

 const docRef = doc(database, `SCHOOLS/${userDetails.school}`);

 try{
   await updateDoc(docRef, {
     notices: updatedNotices
 });
 }
 catch(err){
   console.log(err)
 }
 
}

  return (
    <div >
      <section className='flex gap-5 '>
        <article>
    Number of Students: {students?.length}
   </article>
   <article>
    Number of Classes: {currentlyRegClasses?.length}
   </article>
   </section>

   <section className='flex gap-3'>
   <Calendar onChange={onChange} value={value} tileClassName={tileClassName}/>
    <div>
      <h4>Event</h4>
      {
        // using currently clicked date show event for that day
        datesToAddClassTo.findIndex(item => item.date === formatedDate) >= 0 ?
        datesToAddClassTo.map(item=>{
          if(item.date === formatedDate){return <p>{item.event}</p>}
        })
       :
        <p>No event</p>
      }
    </div>
   </section>

   <section>
    <h4>Notice board</h4>
    {
      // console.log(schoolInfo?.notices)
     schoolInfo && Object.keys(schoolInfo.notices).sort().reverse().map(key => <div className='my-5' key={key}><h3>{schoolInfo.notices[key].title} 
     <span className='ml-4 text-sm'>{schoolInfo.notices[key].timestamp}</span></h3>
     <p>{schoolInfo.notices[key].content} <span onClick={()=>deleteNotice(key)} className="ml-6 underline text-red-400 text-sm">delete</span></p>
     </div>
     )
    }


{/* Add to notice board*/}
    <form onSubmit={(e)=>submitNewNotice(e)}  className='flex flex-col gap-2 w-60'>
      <input type="text" name='title' placeholder='title' onChange={(e)=>handleInput(e)}/>
      <textarea type="text" name='content' placeholder='content' onChange={(e)=>handleInput(e)}/>
      {/* <input type="date" name='timestamp' onChange={(e)=>console.log(e.target.value)}/> */}

      <button>Add</button>
    </form>
   </section>
   
    </div>
  )
}

export default Dashboard