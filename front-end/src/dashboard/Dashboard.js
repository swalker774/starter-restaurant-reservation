import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
        <Link
          to={`/dashboard?date=${getNextDate(date)}`}
          className="btn btn-secondary ml-auto"
        >
          Next
        </Link>
        <Link
          to={`/dashboard?date=${getPreviousDate(date)}`}
          className="btn btn-secondary ml-2"
        >
          Previous
        </Link>
        <Link to="/dashboard" className="btn btn-secondary ml-2">
          Today
        </Link>
      </div>
      <ErrorAlert error={reservationsError} />
      <ul>
        {reservations.map((reservation) => (
          <li key={reservation.reservation_id}>
            <p>Name: {`${reservation.first_name} ${reservation.last_name}`}</p>
            <p>Mobile Number: {reservation.mobile_number}</p>
            <p>Date: {reservation.reservation_date}</p>
            <p>Time: {reservation.reservation_time}</p>
            <p>Party Size: {reservation.people}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

// Helper function to get the next date
function getNextDate(date) {
  const currentDate = new Date(date);
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  return formatDate(nextDate);
}

// Helper function to get the previous date
function getPreviousDate(date) {
  const currentDate = new Date(date);
  const previousDate = new Date(currentDate);
  previousDate.setDate(previousDate.getDate() - 1);
  return formatDate(previousDate);
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export default Dashboard;
