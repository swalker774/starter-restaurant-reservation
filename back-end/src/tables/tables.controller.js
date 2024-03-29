const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function update(req, res, next) {
  const { reservation_id } = req.body.data;
  const table_id = req.params.table_id;

  const table = await service.readTable(table_id);

  if (table.reservation_id) {
    return next({
      status: 400,
      message: `Table ${table_id} is already occupied`,
    });
  }

  if (reservation_id) {
    const reservation = await service.readReservation(reservation_id);

    if (!reservation) {
      return next({
        status: 404,
        message: `Reservation ${reservation_id} not found`,
      });
    }

    if (reservation.people > table.capacity) {
      return next({
        status: 400,
        message: `Table ${table_id} does not have sufficient capacity`,
      });
    }

    await service.updateTable(table_id, { reservation_id });
    await service.updateReservation(reservation_id, { status: "seated" });

    res.json({
      data: {
        table_id,
        reservation_id,
      },
    });
  } else {
    await service.updateTable(table_id, { reservation_id: null });

    res.json({
      data: {
        table_id,
        reservation_id: null,
      },
    });
  }
}

async function finish(req, res, next) {
  const table_id = req.params.table_id;

  const table = await service.readTable(table_id);

  if (!table.reservation_id) {
    return next({
      status: 400,
      message: `Table ${table_id} is not occupied`,
    });
  }

  await service.updateTable(table_id, { reservation_id: null });
  await service.updateReservation(table.reservation_id, { status: "finished" });

  res.json({
    data: {
      table_id,
      reservation_id: table.reservation_id,
    },
  });
}

async function create(req, res, next) {
  const { table_name, capacity } = req.body.data;

  const newTable = await service.createTable({ table_name, capacity });

  res.status(201).json({
    data: newTable,
  });
}

async function list(req, res, next) {
  const tables = await service.listTables();

  res.json({
    data: tables,
  });
}

module.exports = {
  update: asyncErrorBoundary(update),
  finish: asyncErrorBoundary(finish),
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
};
