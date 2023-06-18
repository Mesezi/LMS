import React from 'react'
import { Link } from 'react-router-dom'

const StudentBar = (props) => {
   
  return (
    <Link to={`/admin/students/${props['first name']}_${props['last name']}`} state={{email:props.email}} className='flex gap-3 p-5 bg-slate-300'>
    <h3>{`${props['first name']} ${props['last name']}`}</h3>
    <p>{props.email}</p>
    <p>{props.gender}</p>
    <p>{props['Student class']}</p>

    </Link>
  )
}

export default StudentBar