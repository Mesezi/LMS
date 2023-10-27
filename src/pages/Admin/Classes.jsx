import { getDoc, doc } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { database } from '../../../fireBaseConfig'
import { Link } from 'react-router-dom'

const Classes = () => {
  const registeredClasses = useSelector(state=>state.registeredClasses)
  const userDetails = useSelector((state)=> state.user.userDetails)



  console.log(registeredClasses)


  return (
    <div>
          Classes


      <ul className='flex gap-2 flex-col'>
        {
          registeredClasses && registeredClasses.map(el=> <Link to={`${el}`}>{el}</Link>)
        }
      </ul>
  
    </div>
  )
}

export default Classes