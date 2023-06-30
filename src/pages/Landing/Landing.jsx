import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
   const navigate = useNavigate()


  return (
    <div className='flex flex-col gap-6 items-center'>
        <h4>LOGIN</h4>
        <button onClick={()=> navigate ('/admin-login')}>ADMIN</button>
        <button onClick={()=> navigate ('/student-login')}>STUDENT</button>
        <button onClick={()=> navigate ('/class-login')}>TEACHER</button>
    </div>
  )
}

export default Landing