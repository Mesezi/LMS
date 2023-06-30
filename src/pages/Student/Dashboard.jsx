import {useEffect, useState} from 'react'
import { useOutletContext } from 'react-router-dom'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSelector } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import { database } from '../../../fireBaseConfig';

const Dashboard = () => {
    const [studentSubjects] = useOutletContext()
    const [value, onChange] = useState(new Date());
    const schoolInfo = useSelector(state=>state.schoolInfo)
    const userDetails = useSelector(state=>state.user.userDetails)
    const datesToAddClassTo = [{date:'2023-6-27', event: 'party'}, {date:'2023-6-9', event: 'exam'}, {date:'2023-6-9', event: 'ends'}];

    
function tileClassName({ date, view }) {
    // Add class to tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (datesToAddClassTo.find(dDate => isSameDay(new Date (dDate.date), date))) {
        return 'circle';
      }
    }
  }

  function isSameDay(a, b) {
    return a.getTime() - b.getTime() === 0
  }

const formatedDate = `${value.getFullYear()}-${value.getMonth() + 1}-${value.getDate()}`

const readMessage = async (key) =>{
if(!userDetails.latestNoticeId.includes(key)){
    console.log(key)
    const docRef = doc(database, `SCHOOLS/${userDetails.school}/STUDENTS/${userDetails.email}`);

    try{
      await updateDoc(docRef, {
        latestNoticeId: [...userDetails.latestNoticeId, key]
    });
    }
    catch(err){
      console.log(err)
    }
}

}


  return (
    <div>  <section className='flex gap-5 '>
    <article>
Number of subjects: {studentSubjects?.length}
</article>

<article>
Attendance
</article>

{/* <article>
Number of Classes: {currentlyRegClasses?.length}
</article> */}
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