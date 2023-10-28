import { useState } from "react";
import { useSelector } from "react-redux";
import "react-calendar/dist/Calendar.css";
import Noticeboard from "../../components/Noticeboard";
import EventCalendar from "../../components/EventCalendar";

const Dashboard = () => {
  const students = useSelector((state) => state.students);
  const userDetails = useSelector((state) => state.user.userDetails);

  return (
    <div>
      <section className="flex gap-5 ">
        <article>Number of Students: {students?.length}</article>
        <article>Number of Subjects: {userDetails?.subjects.length}</article>
      </section>

      <EventCalendar />
      <Noticeboard />
    </div>
  );
};

export default Dashboard;
