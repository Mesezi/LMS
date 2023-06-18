import React from 'react'
import { useRef, useEffect } from 'react'
import { auth } from '../../../fireBaseConfig'
import { updateProfile, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { detailsReducer } from '../../store/slice/currentUser'

const Login = () => {

   
    const user = useSelector((state)=> state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate()



       useEffect(() => {

        if(user.authDetails){
          const split = !user.authDetails.displayName ? [] :  user.authDetails.displayName.split('-')

          split[1] === 'admin'&& navigate('/admin/')
        }
       
         
    
       }, [user.authDetails])
       


const email = useRef()
const password = useRef()
    
    const loginUser = async (e) =>{

        e.preventDefault()
  signInWithEmailAndPassword(auth, email.current.value, password.current.value)
  .then((res) => {
    const split = !res.user.displayName ? [] :  res.user.displayName.split('-') 
   
    // const split = res.user?.displayName.split('-') 

    if(split[1] === 'admin'){
      dispatch(detailsReducer({
        school: split[0],
        type: split[1]
      }))
      navigate('/admin/')
      console.log('signed in')
    }
    else{
      signOut(res.user.auth).then(()=> alert('wrong details'))
    }
    
  

  })
  .catch(err => console.log(err.message))


//   updateProfile(res.user, {
//     displayName: 'DEMO-admin',
//  })

    //   e.preventDefault()

    //     try{
    //         const user =  await createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
         
    //         await updateProfile(user.user, {
    //             displayName: "admin"
    //           })
    //     }
    //     catch(err){
    //         alert(err.message)
    //     }
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