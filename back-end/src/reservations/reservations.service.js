const knex = require("../db/connection.js");

function listReservations() {
  return knex("reservations").select("*");
}

function listReservationsByDate(date) {
  return knex("reservations").where({ reservation_date: date }).select("*");
}

function searchReservationsByMobileNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .select("*");
}

function readReservation(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

function createReservation(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function updateReservation(reservation_id, updates) {
  return knex("reservations")
    .where({ reservation_id })
    .update(updates, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  listReservations,
  listReservationsByDate,
  searchReservationsByMobileNumber,
  readReservation,
  createReservation,
  updateReservation,
};
