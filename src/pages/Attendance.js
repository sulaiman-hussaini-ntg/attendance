import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Attendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendance, setAttendance] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [workingDuration, setWorkingDuration] = useState(null);
  const isLoggedIn = localStorage.getItem("employee") != null;

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours() % 12 ? now.getHours() % 12 : 12;
    setCurrentTime(
      hours +
        ":" +
        now.getMinutes() +
        " " +
        (now.getHours() >= 12 ? "pm" : "am")
    );
  };

  useEffect(() => {
    getCurrentTime();
    async function fetchAttendance() {
      const employee = JSON.parse(localStorage.getItem("employee"));
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await axios.get(
          `http://localhost:4000/attendance/${employee["id"]}`,
          config
        );
        console.log(res.data);
        if (res.data) {
          const attendance = JSON.parse(JSON.stringify(res.data));
          setIsCheckedIn(true);
          if (res.data["checkOut"])
            setWorkingDuration(countWorkingTime(attendance));
          setAttendance(attendance);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchAttendance();
  }, []);

  const onClick = async () => {
    const employee = JSON.parse(localStorage.getItem("employee"));
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        "http://localhost:4000/attendance",
        { employeeId: employee["id"] },
        config
      );
      console.log(res.data);
      if (res.data) {
        const attendance = JSON.parse(JSON.stringify(res.data));
        setIsCheckedIn(true);
        if (res.data["checkOut"])
          setWorkingDuration(countWorkingTime(attendance));
        setAttendance(attendance);
      }
    } catch (e) {
      console.error(e);
    }
  };

  setInterval(getCurrentTime, 60 * 1000);

  const countWorkingTime = (attendance) => {
    const now = new Date();
    const date = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeStart = new Date(
      `${date}/${month}/${year} ` +
        attendance["checkIn"]["hour"] +
        ":" +
        attendance["checkIn"]["minute"]
    );
    const timeEnd = new Date(
      `${date}/${month}/${year} ` +
        attendance["checkOut"]["hour"] +
        ":" +
        attendance["checkOut"]["minute"] +
        ":0"
    );
    const difference = timeEnd - timeStart;
    return new Date(difference).toISOString().slice(11, 16);
  };

  if (isLoggedIn) {
    return (
      <div className="attendance-container">
        <h4 className="current-time">Current time {currentTime}</h4>

        <div className="attendance-action-btn" onClick={onClick}>
          <h5>{isCheckedIn ? "Check-out" : "Check-in"}</h5>
        </div>
        {attendance && attendance["checkOut"] && (
          <Fragment>
            <h5>
              Checked-In At{" "}
              {(attendance["checkIn"]["hour"] % 12
                ? attendance["checkIn"]["hour"] % 12
                : 12) +
                ":" +
                attendance["checkIn"]["minute"] +
                (attendance["checkIn"]["hour"] >= 12 ? "pm" : "am")}
            </h5>
            <h5>
              Last Checked-Out{" "}
              {(attendance["checkOut"]["hour"] % 12
                ? attendance["checkOut"]["hour"] % 12
                : 12) +
                ":" +
                attendance["checkOut"]["minute"] +
                (attendance["checkOut"]["hour"] >= 12 ? "pm" : "am")}
            </h5>
            <h5>Completed Duration {workingDuration}</h5>
          </Fragment>
        )}
      </div>
    );
  }

  return (
    <Link to="/" className="login-link">
      <h4>Please Login in...</h4>
    </Link>
  );
};

export default Attendance;
