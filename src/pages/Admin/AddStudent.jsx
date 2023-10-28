import { React, useState, useEffect } from "react";
import { database } from "../../../fireBaseConfig";
import { getDoc, doc, collection, getDocs, setDoc } from "firebase/firestore";
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { async } from "@firebase/util";
import sortClasses from "../../utils/sortClasses";
import { useSelector } from "react-redux";

const AddStudent = () => {
	const userDetails = useSelector(state=>state.user.userDetails)
	const [generateOption, setGenerateOption] = useState(false)
	const [emailList, setEmailList] = useState([{email:''}])

	function inputHandler(e, id){
		const {value} = e.target
		let copy = [...emailList]

		copy.forEach((el, index)=>{
			if(index === id){
				el.email = value.trim()
			}	
		})

		setEmailList(copy)
	}

	const deleteField = (id) => {
		let copy = [...emailList]
		copy = copy.filter((el, index)=> index !== id)
		setEmailList(copy)
	}

	const generateToken= (e) =>{
		e.preventDefault()
		const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';


		function random(){
			let result = '';
			const charactersLength = characters.length;
			for ( let i = 0; i < 10; i++ ) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
			return result
		}

		const tokenMail = emailList.map(item=> ({email: item.email, token:`${random()}-${userDetails.school}`}))

		console.log(tokenMail)


	}

	return (
		<main className="py-10">
			{!generateOption && <section className="flex flex-col gap-3 text-center">
			<button className="p-3 bg-amber-200" onClick={()=>setGenerateOption(true)}>Generate token for students</button>
			<a className="bg-red-700" target='_blank' href='/register-student'>Add student manually</a>

			</section> }

			{generateOption && <section className="flex flex-col gap-3">

			<button onClick={()=>{setEmailList(prev=> [...prev, {email:''}])}} className="self-end p-3 bg-black/50">Add email</button>
		
		<form onSubmit={generateToken}>{
				emailList.map((el, index)=><div>
					<span className="mr-5">{index +1}</span>
             <input onChange={(e)=>inputHandler(e, index)} type="text" name="" id="" value={el.email} placeholder="Email" required/>
			 <span className="text-xl" onClick={()=>deleteField(index)}>-</span>
				</div>)
			}

			<button>Generate tokens</button></form>
			
			
			</section> }
	
		</main>
	);
};

export default AddStudent;
