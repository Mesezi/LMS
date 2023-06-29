import { React, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StudentBar from "../../components/StudentBar";
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { database } from "../../../fireBaseConfig";
import { async } from "@firebase/util";

function Attendance() {
	const studentData = useSelector((state) => state.students);
	const [inSession, setInSession] = useState(true);

	const today = new Date();
	const day = today.getDate();
	const dayOftheWeek = today.getDay();
	const month = today.getMonth() + 1;
	const year = today.getFullYear();
	const todaysDate = `${year}-${month}-${day}`; //set today's date

	//get end of current session and check if the date is still within session date
	useEffect(() => {
		const getCurrentsSession = async () => {
			const sessionRef = doc(database, "SCHOOLS", "DEMO");
			const sessionData = await getDoc(sessionRef);

			if (sessionData.exists()) {
				let endDate = sessionData.data().session.endDate;

				const sessionEnd = new Date(endDate);

				const todayUTC = Date.UTC(
					today.getFullYear(),
					today.getMonth(),
					today.getDate()
				);
				const sessionEndUTC = Date.UTC(
					sessionEnd.getFullYear(),
					sessionEnd.getMonth(),
					sessionEnd.getDate()
				)
				if (todayUTC <= sessionEndUTC) {
					setInSession(true);
					console.log("in sssion");
				} else {
					setInSession(false);
					console.log("out of sssion");
				}
			} else {
				console.log("no such document");
			}
		};
		getCurrentsSession();
	}, []);

	//set current date and student's status to present
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

	//set students absent satus //thinking of using one function for both
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
			{dayOftheWeek === 0 || dayOftheWeek === 6 || !inSession ? ( //check if day is saturday/sunday and also if the school is in session
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
