import React from 'react'
import { useRef, useEffect } from 'react'
import { auth } from '../../../fireBaseConfig'
import { updateProfile, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { detailsReducer } from '../../store/slice/currentUser'
import getSchoolandAccountType from '../../utils/getSchoolandAccountType'

const Login = () => {

   
    const authDetails = useSelector((state)=> state.user.authDetails)
    const dispatch = useDispatch();
    const navigate = useNavigate()


       useEffect(() => {

        if(authDetails){
          const accountDetails = getSchoolandAccountType(authDetails.displayName)
          accountDetails?.type === 'admin' && navigate('/admin/')
        }

       }, [authDetails])
       


const email = useRef()
const password = useRef()
    
  const loginUser = async (e) =>{

   e.preventDefault()

  signInWithEmailAndPassword(auth, email.current.value, password.current.value)
  .then((res) => {
    const accountDetails = getSchoolandAccountType(res.user.displayName)

    if(accountDetails.type === 'admin'){
      navigate('/admin/')
      console.log('signed in')
    }
    else{
      signOut(res.user.auth).then(()=> alert('wrong details'))
    }

  })
  .catch(err => console.log(err.message))

       }


  return (
    <>
    <form onSubmit={(e)=>loginUser(e)} className='flex p-8 rounded-md bg-yellow-50 flex-col gap-5 w-60'>
        <label htmlFor="Eamil">Email</label>
        <input type="mail" ref={email}/>
        <br />
        <label htmlFor="">Password</label>
        <input type="password" ref={password}/>
        <button>Submit</button>
    </form>
    </>
    
  )
}

export default Login