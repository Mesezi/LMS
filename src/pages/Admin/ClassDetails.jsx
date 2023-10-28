import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import { getDoc,doc } from 'firebase/firestore'
import { database } from '../../../fireBaseConfig'
import { Link } from 'react-router-dom'

const ClassDetails = () => {
    const params= useParams()
    const userDetails = useSelector(state=>state.user.userDetails)
    const [classDetails, setClassDetails] = useState()

    useEffect(()=>{
(async()=>{
    const docRef = doc(database, `SCHOOLS/${userDetails.school}/CLASSES/${params.class}`);
    const docSnap = await getDoc(docRef);
    docSnap.exists() ? setClassDetails(docSnap.data()) : console.log('no such document')
})()

    }, [params])

    console.log(classDetails)

  return (
    <div>
<h4>This is {classDetails && classDetails['class name']}</h4>
<div className='flex gap-2 flex-col'>
    {
        classDetails?.subjects.map(el=><Link to={`/admin/classes/${classDetails['class name']}/${el}`}>{el}</Link>)
    }
</div>


    </div>
  )
}

export default ClassDetails