import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { database } from '../../../fireBaseConfig';
import formatDate from '../../utils/formatDate';

const School = () => {
    
        const [name, setName] = useState('');
        const [startDate, setStartDate] = useState('');
        const [endDate, setEndDate] = useState('');
        const schoolInfo = useSelector(state=> state.schoolInfo)
        const userDetails = useSelector(state=>state.user.userDetails)
        const [activityList, setActivityList] = useState()
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];


        const deleteActivity = async (year,month, name) =>{
            let updatedActivity = [...schoolInfo.activity]

           
            let index = updatedActivity.findIndex(item => item.name === name)

            console.log(index)

            updatedActivity.splice(index, 1)

            const docRef = doc(database, `SCHOOLS/${userDetails.school}`);
           
            try{
              await updateDoc(docRef, {
                activity: updatedActivity
            });
            setActivityList(updatedActivity)
            }
            catch(err){
              console.log(err)
            }

            // delete updatedNotices[id]
           
            // const docRef = doc(database, `SCHOOLS/${userDetails.school}`);
           
            // try{
            //   await updateDoc(docRef, {
            //     notices: updatedNotices
            // });
            // }
            // catch(err){
            //   console.log(err)
            // }
            
           }

           function sortEvent(arr){ // this function takes array of events and sorts them in descending order
            arr.sort((a, b) => {
              return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          });
          return arr
           }
      

          useEffect(()=>{

    if(schoolInfo){
    let list = {
      January: [], February: [], March:[], April:[], May:[], June:[], July:[], August:[],September:[],October:[], November:[], December:[]
  }
  let years = {}

   schoolInfo.activity && schoolInfo.activity.forEach(item=>{
    let splitDate = new Date(item.startDate).toDateString().split(' ') // split date into array

   if(!years.hasOwnProperty(splitDate[3])){ // CHECK IF YEAR EXISTS IN OBJECT
    years[splitDate[3]] = {...list}
   }

    let eventMonth = monthNames.filter(month=> month.includes(splitDate[1]))[0] // use short month and get full month
    years[splitDate[3]] = {...years[splitDate[3]], [eventMonth]: sortEvent([...years[splitDate[3]][eventMonth], item])}

    setActivityList(years)
              
       })
      }

           }, [schoolInfo])


          
        const handleSubmit = async (e) => {
          e.preventDefault();

          let updatedStartDate = new Date (`${startDate}`)
          let updatedEndDate =  new Date (`${endDate}`)
         
          if(updatedStartDate.getTime() > updatedEndDate.getTime()){
            alert('End date cannot be earlier than start date.');
            return;
          }

          const newActivity = {name, 
            startDate:  formatDate(updatedStartDate),
            endDate: endDate.length < 1 ? '' : formatDate(updatedEndDate)
        }
           
            const docRef = doc(database, `SCHOOLS/${userDetails.school}`);
           
            try{
              await updateDoc(docRef, {
                activity: [...schoolInfo?.activity, newActivity]
            });
            }
            catch(err){
              console.log(err)
            }

        };

      
        return (
         <main>
             <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <label>
              Activity Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                
              />
            </label>
            <button type="submit">Submit</button>
          </form>


          <section>
            {

              activityList &&  Object.keys(activityList).map(year=>{

                return <div>
                  <h2 className='text-3xl text-center font-bold'>{year}</h2>

                  {
                    Object.keys(activityList[year]).map(month=>{
                      if(activityList[year][month].length > 0){

                        return <div key={month} className='my-4'>
                         <h5 className="text-xl font-bold border-solid border-b-4">{month}</h5>
      
                         {
                           activityList[year][month].map((el, index)=>  <div className='flex gap-4'>
                           <p>{el.startDate}</p>
                           <h3>{el.name}</h3>
                           <button className='ml-auto text-red-400' onClick={()=>deleteActivity(year, month, el.name)}>delete</button>
                           </div>)  
                         }
                        </div>
                     }
                    } )
                  



                  }
                </div>
                

                   
                   
                })
            }
          </section>
         </main>
        );
      
      
}

export default School