import { React, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { database } from "../../../fireBaseConfig";
import {
	doc,
	getDoc,
	updateDoc,
	arrayUnion,
} from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { setClass } from "../../store/slice/currentClass";

function Timetable() {
	const [currentlyRegClasses] = useOutletContext();
	const [currentClass, setCurrentClass] = useState();
	const [TableData, setTableData] = useState([]);
	const dispatch = useDispatch();
	const [dailyData, setDailyData] = useState([]);
	const [TableModel, setTableModel] = useState({
		start: "",
		end: "",
		subject: "",
	});

	const [selectedDay, setSelectedDay] = useState();
	const selectedClass = useSelector((state) => state.selectedClass); //redux flex //selcected class for view


	//view schedule functions
	const getTimetableData = async (classname) => {
		const docRef = doc(database, `SCHOOLS/DEMO/CLASSES/${classname}`);
		const docData = await getDoc(docRef);
		if (docData.exists()) {
			// console.log(docData.data().Timetable)
			if(docData.data().Timetable){
				setTableData(docData.data().Timetable);
			}
			else{
				alert('please contact administrator, error 505')
				setTableData([])
				return
			}
			
		} else {
			console.log("No such document");
		}
	};

	const handleChange = (e, type) => {
		if (type) {
			dispatch(setClass(e.target.value));
			getTimetableData(e.target.value);
			return;
		} else {
			dispatch(setClass(e.target.value)); //when select is being used in create section
		}
	};

	const handleInputData = (day, id, e) => {
		// console.log(day, id)
		const { name, value } = e.target;
		//  console.log(day, id, value)
		setTableData((prevData) => {
			const updatedData = {
				...prevData,
				[day]: prevData[day].map((item) => {
					if (item.id === id) {
						return {
							...item,
							[name]: value,
						};
					} else {
						return item;
					}
				}),
			};

			return updatedData;
		});
	};

	const handleUpate = async () => {
		const timeTableRef = doc(database, `SCHOOLS/DEMO/CLASSES/${selectedClass}`);
		await updateDoc(timeTableRef, {
			Timetable: TableData, //uload edited fields
		})
			.then((data) => {
				console.log(data);
				alert("data successfully updated");
			})
			.catch((error) => {
				console.log(error);
			});
	};




	//add timetable functions
	const handleDay = (e) => {
		e.target.value;
		setSelectedDay(e.target.value);
	};

	const generateId = () => {
		return Math.floor(Math.random() * Date.now()).toString(16);
	};

	const createField = (e) => {
		console.log(selectedDay)
		let dbData;
		e.preventDefault();
		let id = generateId();
		let UpdatedModel = {
			...TableModel,
			id: id,
		};
	  let data = FetchData();
	  if(data){
		data.then((list)=>{
			if(list){
				dbData = list
				checkDuplicate(dbData, UpdatedModel )
			}
			else{
				alert('timetable not present, contact administrator, error 405')
			}
		  }).catch((error)=>{
			console.log(error)
		  })
	  }

	};

	const checkDuplicate = (databaseData, newData)=>{
        if(databaseData[selectedDay].some((item)=>item.start === newData.start)){
			alert("time schedule already exists, please check input fields and try again")
		}
		else{
			 submitCreatedField(newData)
		}
	}

	const submitCreatedField = async (data) => {
		const dataRef = doc(database, `SCHOOLS/DEMO/CLASSES/${selectedClass}`);
		const docRef = await updateDoc(dataRef, {
			[`Timetable.${selectedDay}`]: arrayUnion(data),
		})
			.then(() => {
				alert("data updated succssfully");
			})
			.catch((error) => {
				alert("an error occured", error);
			});
	};

	const FetchData = async() =>{
		const dataRef = doc(database, `SCHOOLS/DEMO/CLASSES/${selectedClass}`);
		const docRef = await getDoc(dataRef)

		if(docRef.exists()){
		 return docRef.data().Timetable
		}
		else{
			alert("data not available")
		}
	}

	const handleData = (e) => {
		const { name, value } = e.target;
		setTableModel({ ...TableModel, [name]: value });
	};

	return (
		<div>
			<p className='text-2xl'>Welcome admin!</p>
			<select
				onChange={(e) => handleChange(e, "view")}
				name='student class'
				className='border-2 border-rose-500 w-60'
			>
				<option value={null}>Select Class</option>
				{currentlyRegClasses &&
					currentlyRegClasses.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
			</select>

			{/* //refactor, too much repetition */}
			<p>Timetable for {currentClass} 2022-2023 Session</p>

			<p className='text-2xl mt-4'>MONDAY SCHEDULE</p>
			{Object.keys(TableData).length > 0
				? TableData["Monday"].map((item) => {
						return (
							<div key={item.id}>
								<div className='flex gap-1'>
									<input
										onChange={(e) => handleInputData("Monday", item.id, e)}
										name='start'
										value={item.start}
									/>
									<input
										onChange={(e) => handleInputData("Monday", item.id, e)}
										name='end'
										value={item.end}
									/>
									<input
										onChange={(e) => handleInputData("Monday", item.id, e)}
										name='subject'
										value={item.subject}
									/>
								</div>
							</div>
						);
				  })
				: null}
			<div className='btn-group flex gap-5'>
				{/* <Link to={'1'}><button>View</button></Link> */}
			</div>

			<p className='text-2xl mt-4'>TUESDAY SCHEDULE</p>
			{Object.keys(TableData).length > 0
				? TableData["Tuesday"].map((item) => {
						return (
							<div key={item.id}>
								<div className='flex gap-1'>
									<input
										onChange={(e) => handleInputData("Tuesday", item.id, e)}
										name='start'
										value={item.start}
									/>
									<input
										onChange={(e) => handleInputData("Tuesday", item.id, e)}
										name='end'
										value={item.end}
									/>
									<input
										onChange={(e) => handleInputData("Tuesday", item.id, e)}
										name='subject'
										value={item.subject}
									/>
								</div>
							</div>
						);
				  })
				: null}

			<p className='text-2xl mt-4'>WEDNESDAY SCHEDULE</p>
			{Object.keys(TableData).length > 0
				? TableData["Wednesday"].map((item) => {
						return (
							<div key={item.id}>
								<div className='flex gap-1'>
									<input
										onChange={(e) => handleInputData("Wednesday", item.id, e)}
										name='start'
										value={item.start}
									/>
									<input
										onChange={(e) => handleInputData("Wednesday", item.id, e)}
										name='end'
										value={item.end}
									/>
									<input
										onChange={(e) => handleInputData("Wednesday", item.id, e)}
										name='subject'
										value={item.subject}
									/>
								</div>
							</div>
						);
				  })
				: null}

			<p className='text-2xl mt-4'>THURSDAY SCHEDULE</p>
			{Object.keys(TableData).length > 0
				? TableData["Thursday"].map((item) => {
						return (
							<div key={item.id}>
								<div className='flex gap-1'>
									<input
										onChange={(e) => handleInputData("Thursday", item.id, e)}
										name='start'
										value={item.start}
									/>
									<input
										onChange={(e) => handleInputData("Thursday", item.id, e)}
										name='end'
										value={item.end}
									/>
									<input
										onChange={(e) => handleInputData("Thursday", item.id, e)}
										name='subject'
										value={item.subject}
									/>
								</div>
							</div>
						);
				  })
				: null}

			<p className='text-2xl mt-4'>FRIDAY SCHEDULE</p>
			{Object.keys(TableData).length > 0
				? TableData["Friday"].map((item) => {
						return (
							<div key={item.id}>
								<div className='flex gap-1'>
									<input
										onChange={(e) => handleInputData("Friday", item.id, e)}
										name='start'
										value={item.start}
									/>
									<input
										onChange={(e) => handleInputData("Friday", item.id, e)}
										name='end'
										value={item.end}
									/>
									<input
										onChange={(e) => handleInputData("Friday", item.id, e)}
										name='subject'
										value={item.subject}
									/>
								</div>
							</div>
						);
				  })
				: null}
			<div className='btn-group flex gap-5'>
				<button
					className='bg-black text-white p-2 rounded-full'
					onClick={handleUpate}
				>
					Save
				</button>
			</div>

			<div className='text-3xl'>CREATE TIMETABLE</div>
			<select
				onChange={handleChange}
				name='student class'
				className='border-2 border-rose-500 w-60'
			>
				<option value={null}>Select Class</option>
				{currentlyRegClasses &&
					currentlyRegClasses.map((item) => (
						<option key={item} value={item}>
							{item}
						</option>
					))}
			</select>

			<select
				onChange={handleDay}
				name='selectedDay'
				className='border-2 border-rose-500 w-60'
			>
				<option value={null}>Select day</option>
				<option value={"Monday"}>Monday</option>
				<option value={"Tuesday"}>Tuesday</option>
				<option value={"Wednesday"}>Wednesday</option>
				<option value={"Thursday"}>Thursday</option>
				<option value={"Friday"}>Friday</option>
			</select>

			<p>DAY : {selectedDay}</p>
			<p>No of Periods created: {dailyData.length}</p>

			<form className='flex flex-col mt-5'>
				{/* <input type="text"  	className='border-2 border-rose-500 w-60' name="day" placeholder="day" value={TableModel.day}/> */}
				<input
					type='text'
					required
					onChange={handleData}
					className='border-2 border-rose-500 w-60'
					name='start'
					placeholder='start'
				/>
				<input
					type='text'
					required
					onChange={handleData}
					className='border-2 border-rose-500 w-60'
					name='end'
					placeholder='end'
				/>
				<input
					type='text'
					required
					onChange={handleData}
					className='border-2 border-rose-500 w-60'
					name='subject'
					placeholder='subject'
				/>
				<button
					onClick={createField}
					className='bg-black text-white p-2 rounded-full mt-5 self-start'
				>
					ADD
				</button>
			</form>

			{}
		</div>
	);
}

export default Timetable;
