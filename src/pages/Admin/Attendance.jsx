import React from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentBar from "../../components/StudentBar";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { database } from "../../../fireBaseConfig";
import { async } from "@firebase/util";

function Attendance() {
	const studentData = useSelector((state) => state.students);

	console.log(studentData);

	const today = new Date();
	const day = today.getDate();
	const dayOftheWeek = today.getDay();
	console.log(dayOftheWeek);
	const month = today.getMonth() + 1;
	const year = today.getFullYear();
	const todaysDate = `${day}/${month}/${year}`;

	const present = async (id) => {
		console.log("present");
		const dateRef = doc(
			database,
			"SCHOOLS",
			"DEMO",
			"STUDENTS",
			`${id}`,
			"ATTENDANCE",
			"2023-2024"
		);
		//check for weekends

		try {
			const docSnapshot = await getDoc(dateRef);
			const existingData = docSnapshot.data() || {};

			const dates = existingData.dates || [];
			const existingDate = dates.find(
				(date) => Object.keys(date)[0] === todaysDate
			);

			if (existingDate) {
				console.log(existingDate);
				// Update existing date's boolean value
				existingDate[todaysDate] = "present";
			} else {
				// Add new date as a key-value pair
				dates.push({ [todaysDate]: "present" });
			}

			const updatedData = { dates };
			await updateDoc(dateRef, updatedData);
			console.log("Updated successfully");
			alert("Updated successfully");
		} catch (error) {
			console.log(error);
			alert(error);
		}
	};

	//id is email //thinking of using one function for both
	const absent = async (id) => {
		const dateRef = doc(
			database,
			"SCHOOLS",
			"DEMO",
			"STUDENTS",
			`${id}`,
			"ATTENDANCE",
			"2023-2024"
		);

		try {
			const docSnapshot = await getDoc(dateRef);
			const existingData = docSnapshot.data() || {};

			const dates = existingData.dates || [];
			const existingDate = dates.find(
				(date) => Object.keys(date)[0] === todaysDate
			);

			if (existingDate) {
				// Update existing date's boolean value
				existingDate[todaysDate] = "absent";
			} else {
				// Add new date as a key-value pair
				dates.push({ [todaysDate]: "absent" });
			}

			const updatedData = { dates };
			await updateDoc(dateRef, updatedData);
			console.log("Updated successfully");
			alert("Updated successfully");
		} catch (error) {
			console.log(error);
			alert(error);
		}
	};

	return (
		<div className='ps-2'>
			<div className='text-2xl'>Attendance</div>
			<p>Add Today's attendance</p>
			{dayOftheWeek === 0 || dayOftheWeek === 6 ? (
				<section> Not a weekday, Check back tomorrow</section>
			) : (
				<section>
					{!studentData ? (
						<p>loading...</p>
					) : (
						<div className='flex flex-col gap-3'>
							{studentData?.map((student) => {
								return (
									<StudentBar
										{...student}
										absent={() => absent(student.email)}
										present={() => present(student.email)}
									/>
								);
							})}
						</div>
					)}
				</section>
			)}
		</div>
	);
}

export default Attendance;
