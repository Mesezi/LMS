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

const RegisterStudent = () => {
	const auth = getAuth();
	const [classes, setClasses] = useState([]);
	const [schoolName, setSchoolName] = useState();
	const [token, setToken] = useState("");
	const [formData, setformData] = useState({});

	//fetch list of classes with entered school token
	const fetchClasses = async (schoolid) => {
		setSchoolName(schoolid);
		let data = [];
		const classesRef = collection(
			database,
			"SCHOOLS",
			`${schoolid}`,
			"CLASSES"
		);
		const listofClasses = await getDocs(classesRef);
		listofClasses.forEach((doc) => {
			console.log(doc.id, " => ", doc.data());
			data.push(doc.id);
		});

		setClasses(sortClasses(data));
	};

	//listen for changes in the form, excluding the token
	const handleChange = (e) => {
		const { name, value } = e.target;

		console.log(name, value);

		setformData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	};

	//listen for changes in the token field
	const handleToken = (e) => {
		const { name, value } = e.target;
		setToken(value);
	};

	//verify token and use to fetch aschool name
	const verifyToken = async () => {
		const TokenRef = doc(database, "TOKENS", `${token}`);
		const School = await getDoc(TokenRef);

		if (School.exists()) {
			let data = School.data();
			fetchClasses(data.school);
		} else {
			alert("Invalid id, please get a life");
		}
	};

	//save student details in db
	const saveStudentDetails = async () => {
		console.log(formData, schoolName);

		const docRef = doc(
			database,
			`SCHOOLS/${schoolName}/STUDENTS/${formData.email}`
		);

		try {
			const data = formData;
			delete data.password;
			console.log(data);
			await setDoc(docRef, { ...data });

			console.log("file updated");

			//update student's display name
			updateProfile(auth.currentUser, {
				displayName: `${schoolName}-student`,
			}).then(() => {
				alert("profile updated");
				auth.signOut();
			});
		} catch (err) {
			console.log(err);
		}
	};

	//submit form details
	const handleSubmit = async (e) => {
		e.preventDefault();
		createUserWithEmailAndPassword(auth, formData.email, formData.password)
			.then((userCredential) => {
				// Signed in
				saveStudentDetails();
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				alert(errorMessage);
				// ..
			});
	};

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-8 w-50 ps-8'>
			<div className='text-2xl'>Add Student</div>
			<p className='text-red-600'>
				Before you proceed, Enter your school unique token
			</p>

			<input
				type='text'
				name='token'
				className='border-2 border-rose-500 w-60'
				placeholder='token'
				value={token}
				onChange={handleToken}
			/>
			<div>
				<button
					type='button'
					className='bg-black text-white p-2 rounded-full'
					onClick={verifyToken}
				>
					verify
				</button>
			</div>

			<input
				onChange={handleChange}
				type='text'
				name='first name'
				placeholder='enter your first name'
				className='border-2 border-rose-500 w-60'
			/>

			<input
				onChange={handleChange}
				type='text'
				name='last name'
				placeholder='enter your Last name'
				className='border-2 border-rose-500 w-60'
			/>

			<input
				onChange={handleChange}
				type='text'
				name='email'
				placeholder='enter valid email address'
				className='border-2 border-rose-500 w-60'
			/>
			<input
				onChange={handleChange}
				type='text'
				name='password'
				placeholder='enter password'
				className='border-2 border-rose-500 w-60'
			/>
			<input
				onChange={handleChange}
				type='text'
				name='age'
				placeholder='age'
				className='border-2 border-rose-500 w-60'
			/>
			<input
				onChange={handleChange}
				type='text'
				name='mothersMaiden'
				placeholder="mother's maiden name"
				className='border-2 border-rose-500 w-60'
			/>

			<select
				onChange={handleChange}
				name='gender'
				className='border-2 border-rose-500 w-60'
			>
				<option value={null}>Select Gender</option>
				<option value='male'>Male</option>
				<option value='female'>Female</option>
			</select>

			<select
				onChange={handleChange}
				name='student class'
				className='border-2 border-rose-500 w-60'
			>
				<option value={null}>Select Class</option>
				{classes.length > 0 && classes.map((item) => <option value={item}>{item}</option>)}
			</select>

			<div>
				<button type='submit' className='bg-black text-white p-2 rounded-full'>
					Create Student
				</button>
			</div>
		</form>
	);
};

export default RegisterStudent;
