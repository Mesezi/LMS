import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'

const StudentBar = (props) => {
	return (
    <div>
		<Link
			to={`/admin/students/${props["first name"]}_${props["last name"]}`}
			state={{ email: props.email }}
			className='flex  flex-col gap-3 p-5 bg-slate-300'
		>
			<h3>{`${props["first name"]} ${props["last name"]}`}</h3>
			<p>{props.email}</p>
			<p>{props.gender}</p>
			<p>{props["student class"]}</p>
		</Link>
    <div>
				<p>Attendance Status</p>
				<button type='button' onClick={()=>props.present(props.email)} className='bg-black text-white p-2 rounded-full block'>
					Present
				</button>
				<button type='button' onClick={()=>props.absent(props.email)} className='bg-black text-white p-2 rounded-full block mt-2'>
					Absent
				</button>
			</div>
      </div>  

	);
};

export default StudentBar;
