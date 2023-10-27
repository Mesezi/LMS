import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import formatDate from "../utils/formatDate";

const EventCalendar = () => {
  const [value, onChange] = useState(new Date());
  const schoolInfo = useSelector((state) => state.schoolInfo);

  function tileClassName({ date, view }) {
    if (schoolInfo && view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (
        schoolInfo.activity.find(
          (dDate) => formatDate(new Date(dDate.startDate)) === formatDate(date)
        )
      ) {
        return "circle";
      }
    }
  }

  return (
    <section className="flex gap-3">
      <Calendar
        onChange={onChange}
        value={value}
        tileClassName={tileClassName}
      />
      <div>
        <h4>Event</h4>
        {
          // using currently clicked date show school activity for that day
          schoolInfo &&
          schoolInfo.activity.find(
            (item) =>
              formatDate(new Date(item.startDate)) ===
              formatDate(new Date(value))
          ) ? (
            schoolInfo.activity.map((item) => {
              if (
                formatDate(new Date(item.startDate)) ===
                formatDate(new Date(value))
              ) {
                return <p>{item.name}</p>;
              }
            })
          ) : (
            <p>No event</p>
          )
        }
      </div>
    </section>
  );
};

export default EventCalendar;
