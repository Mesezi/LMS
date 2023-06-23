import { React, useState, useEffect } from "react";
import { database } from "../../../fireBaseConfig";
import { getDoc, doc, collection, getDocs, setDoc } from "firebase/firestore";
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { async } from "@firebase/util";

const AddStudent = () => {
	const auth = getAuth();
	const [classes, setClasses] = useState([]);
	const [schoolName, setSchoolName] = useState();
	const [token, setToken] = useState("");
	const [formData, setformData] = useState({
		fullName: "",
		email: "",
		password: "",
		age: "",
		mothersMaiden: "",
		class: "",
	});

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
		setClasses(data);
	};

	//listen for changes in the form, excluding the token
	const handleChange = (e) => {
		const { name, value } = e.target;
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
		await setDoc(
			doc(
				database,
				"SCHOOLS",
				`${schoolName}`,
				"STUDENTS",
				`${formData.email}`
			),
			{
				email: formData.email,
				fullName: formData.fullName,
				age: formData.age,
				mothersMaiden: formData.mothersMaiden,
				class: formData.class,
			}
		)
			.then(() => {
				alert("data stored");
			})
			.catch((error) => {
				alert("unable to save data");
				console.log(error);
			});
	};

	//update student's display name
	const updateStudentProfile = () => {
		console.log(`${schoolName}-${formData.fullName}`);
		updateProfile(auth.currentUser, {
			displayName: `${schoolName}-${formData.fullName}`,
		})
			.then(() => {
				alert("profile updated");
			})
			.catch((error) => {
				alert(error.message);
			});
	};

	//submit form details
	const handleSubmit = (e) => {
		e.preventDefault();
		createUserWithEmailAndPassword(auth, formData.email, formData.password)
			.then((userCredential) => {
				// Signed in
				updateStudentProfile();
				saveStudentDetails();
				alert("successfully created");
				const user = userCredential.user;
				auth.signOut();
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
			<div className='text-2xl'>AddStudent</div>
			<p className='text-red-600'>
				Before you proceed, Enter your unique token
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
				name='fullName'
				placeholder='enter your name'
				value={formData.fullName}
				className='border-2 border-rose-500 w-60'
			/>
			<input
				onChange={handleChange}
				type='text'
				name='email'
				placeholder='enter valid email address'
				value={formData.email}
				className='border-2 border-rose-500 w-60'
			/>
			<input
				onChange={handleChange}
				type='text'
				name='password'
				placeholder='enter password'
				value={formData.password}
				className='border-2 border-rose-500 w-60'
			/>
			<input
				onChange={handleChange}
				type='text'
				name='age'
				placeholder='age'
				className='border-2 border-rose-500 w-60'
				value={formData.age}
			/>
			<input
				onChange={handleChange}
				type='text'
				name='mothersMaiden'
				placeholder="mother's maiden name"
				value={formData.mothersMaiden}
				className='border-2 border-rose-500 w-60'
			/>

			<select
				onChange={handleChange}
				name='class'
				className='border-2 border-rose-500 w-60'
			>
				{classes.length > 0 ? (
					classes.map((item) => <option value={item}>{item}</option>)
				) : (
					<option value={null}>Select Student</option>
				)}
			</select>

			<div>
				<button type='submit' className='bg-black text-white p-2 rounded-full'>
					Create Student
				</button>
			</div>
		</form>
	);
};

export default AddStudent;
