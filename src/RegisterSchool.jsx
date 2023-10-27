import React, { useState } from 'react'
import { getDocs, collection, setDoc,doc, updateDoc } from 'firebase/firestore'
import { database } from '../fireBaseConfig'
import { useEffect } from 'react'
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const RegisterSchool = () => {

  const [schools, setSchools] = useState()
  const [registrationDetails, setRegistrationDetails] = useState({
    firstName:'',
    lastName:'',
    email:'',
    telephone:'',
    password:'',
    schoolShortName:'',
    schoolFullName: ''
  })
  const [loading, setLoading] = useState(false)
  const auth = getAuth()
  const navigate = useNavigate()


  useEffect(()=>{

    (async ()=>{
      let dbSchools = [] 
      const currentSchools = await getDocs(collection(database, 'SCHOOLS'))

      currentSchools.forEach((doc)=>{
        dbSchools.push(doc.id)
      })

      setSchools(dbSchools)


    })()

  }, [])

  console.log(schools)


  const register = async (e) =>{
    setLoading(true)
    e.preventDefault()
    console.log(registrationDetails)

    try{
      const credentials = await createUserWithEmailAndPassword(auth, registrationDetails.email, registrationDetails.password)

      console.log(credentials)

      await updateProfile(auth.currentUser, {displayName: `${registrationDetails.schoolShortName}-admin`})

      const data = {...registrationDetails};
			delete data.password;


      await setDoc(doc(
        database,
        `USERS/${credentials.user.uid}`
      ), {...data});

      const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


		function random(){
			let result = '';
			const charactersLength = characters.length;
			for ( let i = 0; i < 5; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result
		}

		const schoolToken = `${random()}-${registrationDetails.schoolShortName}`

			await setDoc(doc(
        database,
        `SCHOOLS/${registrationDetails.schoolShortName}`
      ), { schoolFullName: registrationDetails.schoolFullName,
        schoolShortName: registrationDetails.schoolShortName,
      activity: [],
      grading: {},
      notices: {},
      session: {},
      subjects: {},
      classesAccount: false,
      schoolToken
      });

      await setDoc(doc(
        database,
        `TOKENS/${schoolToken}`
      ), { schoolFullName: registrationDetails.schoolFullName,
        schoolShortName: registrationDetails.schoolShortName,
      });


      setLoading(false)
      alert('successful')

    // const split =  credentials.user.displayName.split('-') 

    // if(split[1] === 'admin'){
    //   navigate('/admin/')
    //   console.log('signed in')
    // }

      navigate('/admin')

    }

    catch(err){
      console.log(err)

    }

   
		


  }

  const inputHandler = (e)=>{
    console.log(e.target.value)
    const {value, name} = e.target
    setRegistrationDetails(prev=> ({...prev, [name]: value}))
  }


  return (
   <main className=' text-center py-16'>
    <h3>SCHOOL MANAGEMENT SYSTEM</h3>
    <form onSubmit={register} className='flex flex-col w-[70%] gap-5 mt-5 mx-auto'>

      <div>
        <h2>
          Personal Information
        </h2>
        <input className='p-2 w-full' name='firstName' value={registrationDetails.firstName} 
        required onChange={inputHandler} type="text" placeholder='First name'/>
        
        <input className='p-2 w-full' name='lastName' value={registrationDetails.lastName}  
        required onChange={inputHandler} type="text" placeholder='Last name'/>

        <input className='p-2 w-full' name='email' value={registrationDetails.email}  
        required onChange={inputHandler} type='mail' placeholder='Email address'/>

        <input className='p-2 w-full' name='telephone' value={registrationDetails.telephone}  
        required onChange={inputHandler} type="text" placeholder='Phone number'/>

        <input className='p-2 w-full' name='password' value={registrationDetails.password}  
        required onChange={inputHandler} type='password' placeholder='Password'/>
      </div>


      <div>
        <h2>
          School Information
        </h2>
        <input className='p-2 w-full' name='schoolFullName' value={registrationDetails.schoolFullName} 
        required onChange={inputHandler} type="text" placeholder='School name'/>

        <input className='p-2 w-full' name='schoolShortName' value={registrationDetails.schoolShortName} 
        required onChange={inputHandler} type="text" placeholder='School short name'/>
      </div>

    {/* <input className='p-2 w-full' type="mail" placeholder='admin email'/>

    <input className='p-2 w-full' type="mail" placeholder='class email'/> */}

    <button disabled={loading}>{loading ? 'loading' : "Submit"}</button>

    </form>
   </main>
  )
}

export default RegisterSchool