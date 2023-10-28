import { useState } from "react";
import { useSelector } from "react-redux";
import Noticeboard from "../../components/Noticeboard";
import EventCalendar from "../../components/EventCalendar";

const Dashboard = () => {
  const students = useSelector((state) => state.students);
  const registeredClasses = useSelector((state) => state.registeredClasses);

  return (
    <div>
      <section className="flex gap-5 ">
        <article>Number of Students: {students?.length}</article>
        <article>Number of Classes: {registeredClasses?.length}</article>
      </section>


      <EventCalendar />
      <Noticeboard />
    </div>
  );
};

export default Dashboard;
