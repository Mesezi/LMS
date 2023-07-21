import {useState} from 'react'
import { useSelector } from 'react-redux'
import { useOutletContext } from 'react-router-dom'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import getCurrentDate from '../../utils/getCurrentDate';
import { doc, updateDoc } from 'firebase/firestore';
import { database } from '../../../fireBaseConfig';
import formatDate from '../../utils/formatDate';


const Dashboard = () => {
const students = useSelector(state=>state.students)
const [value, onChange] = useState(new Date());
const schoolInfo = useSelector(state=>state.schoolInfo)
const userDetails = useSelector(state=>state.user.userDetails)


function tileClassName({ date, view }) {
  if(schoolInfo && view === 'month'){
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (schoolInfo.activity.find(dDate => formatDate(new Date (dDate.startDate)) === formatDate(date))) {
        return 'circle';
      }
  }
}

const readMessage = async (key) =>{
  if(!userDetails.latestNoticeId.includes(key)){
      console.log(key)
      const docRef = doc(database, `SCHOOLS/${userDetails.school}/CLASSES/${userDetails.className}`);
  
      try{
        await updateDoc(docRef, {
          latestNoticeId: [...userDetails.latestNoticeId, key]
      });
      console.log('done')
      }
      catch(err){
        console.log(err)
      }
  }
  
  }



  return (
    <div >
      <section className='flex gap-5 '>
        <article>
    Number of Students: {students && students.length}
   </article>
   <article>
    Number of Subjects: {userDetails && userDetails.subjects.length}
   </article>
   </section>

   <section className='flex gap-3'>
   <Calendar onChange={onChange} value={value} tileClassName={tileClassName}/>
    <div>
      <h4>Event</h4>
      {
        // using currently clicked date show school activity for that day
       schoolInfo && schoolInfo.activity.find(item => formatDate(new Date(item.startDate)) === formatDate(new Date(value))) ?
        schoolInfo.activity.map(item=>{
          if(formatDate(new Date(item.startDate)) === formatDate(new Date(value))){
            return <p>{item.name}</p>}
        })
       :
        <p>No event</p>
      }
    </div>
   </section>

  
   <section>
    <h4>Notice board </h4>

    {
      // console.log(schoolInfo?.notices)
     schoolInfo && Object.keys(schoolInfo.notices).sort().reverse().map(key => (
     <div onClick={()=>readMessage(key)} className={`my-5 ${!userDetails.latestNoticeId.includes(key)&& 'bg-black/40'}`} key={key}><h3>{schoolInfo.notices[key].title} 
     <span className='ml-4 text-sm'>{schoolInfo.notices[key].timestamp}</span></h3>
     <p>{schoolInfo.notices[key].content}</p>
     </div>)
     )
    }
   </section>
   
    </div>
  )
}

export default Dashboard