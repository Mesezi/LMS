import {useState} from 'react'
import { useSelector } from 'react-redux'
import { useOutletContext } from 'react-router-dom'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';





const Dashboard = () => {
const students = useSelector(state=>state.students)
const [currentlyRegClasses] = useOutletContext()
const [value, onChange] = useState(new Date());

const datesToAddClassTo = [{date:'2023-6-27', ['event']: 'party'}, {date:'2023-6-29', ['event']: 'exam'}];

function isSameDay(a, b) {
  return a.getTime() - b.getTime() === 0
}

// function tileContent({ date, view }) {
//   // Add class to tiles in month view only
//   if (view === 'month') {
//     // Check if a date React-Calendar wants to check is on the list of dates to add class to
//     if (datesToAddClassTo.find(dDate => isSameDay(new Date (dDate.date), date))) {
//       return `hi`;
//     }
//   }
// }

function tileClassName({ date, view }) {
  // Add class to tiles in month view only
  if (view === 'month') {
    // Check if a date React-Calendar wants to check is on the list of dates to add class to
    if (datesToAddClassTo.find(dDate => isSameDay(new Date (dDate.date), date))) {
      return 'bg-green-400';
    }
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

   <section>
   <Calendar onChange={onChange} value={value} tileClassName={tileClassName}/>
   </section>
   
    </div>
  )
}

export default Dashboard