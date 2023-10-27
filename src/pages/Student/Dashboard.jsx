import { useOutletContext } from 'react-router-dom'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSelector } from 'react-redux';
import formatDate from '../../utils/formatDate';
import Noticeboard from '../../components/Noticeboard';
import EventCalendar from '../../components/EventCalendar'


const Dashboard = () => {
    const [studentSubjects] = useOutletContext()
    const schoolInfo = useSelector(state=>state.schoolInfo)

   


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

<EventCalendar />
<Noticeboard />

</div>

  )

}

export default Dashboard