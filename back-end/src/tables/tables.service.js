const knex = require("../db/connection.js");

function listTables() {
  return knex("tables").select("*");
}

function readTable(table_id) {
  return knex("tables").where({ table_id }).first();
}

function createTable(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function updateTable(table_id, updates) {
  return knex("tables")
    .where({ table_id })
    .update(updates, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

function readReservation(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

function updateReservation(reservation_id, updates) {
  return knex("reservations")
    .where({ reservation_id })
    .update(updates, "*")
    .then((updatedRecords) => updatedRecords[0]);
}

module.exports = {
  listTables,
  readTable,
  createTable,
  updateTable,
  readReservation,
  updateReservation,
};
