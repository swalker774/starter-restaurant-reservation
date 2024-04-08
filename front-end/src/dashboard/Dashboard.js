import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { next, previous, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ReservationList from "../reservations/ReservationList";
import TableList from "../tables/TableList";
import {
  listReservations,
  listTables,
  finishTable,
  updateStatus,
} from "../utils/api";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const history = useHistory();
  const filterResults = true;

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables().then(setTables);
    return () => abortController.abort();
  }

  async function finishHandler(table_id) {
    const abortController = new AbortController();
    const result = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (result) {
      await finishTable(table_id, abortController.signal);
      loadDashboard();
    }
    return () => abortController.abort();
  }

  const cancelHandler = async (event) => {
    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (result) {
      await updateStatus(event.target.value, "cancelled");
      loadDashboard();
    }
  };

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    return `${formattedDate.toLocaleDateString("en-US", {
      weekday: "long",
    })} ${formattedDate.toLocaleDateString("en-US", {
      month: "short",
    })} ${formattedDate.getDate()} ${formattedDate.getFullYear()}`;
  };

  return (
    <main>
      <ErrorAlert error={reservationsError} />
      <div className="group">
        <div className="item-double">
          <div className="group">
            <div className="item-double">
              <h2>Reservations for {formatDate(date)}</h2>
            </div>
            <div className="item centered">
              <div className="group-row">
                <button
                  className="item black"
                  onClick={() =>
                    history.push(`/dashboard?date=${previous(date)}`)
                  }
                >
                  Previous
                </button>
                <button
                  className="item black"
                  onClick={() => history.push(`/dashboard?date=${today()}`)}
                >
                  Today
                </button>
                <button
                  className="item black"
                  onClick={() => history.push(`/dashboard?date=${next(date)}`)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <hr></hr>
          <div id="reservations" className="group-col">
            <ReservationList
              reservations={reservations}
              filterResults={filterResults}
              cancelHandler={cancelHandler}
            />
          </div>
        </div>
        <div id="tables" className="item">
          <h2>Tables</h2>
          <hr></hr>
          <TableList tables={tables} finishHandler={finishHandler} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
