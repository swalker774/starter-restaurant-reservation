const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function updateStatus(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;

  if (!["booked", "seated", "finished", "cancelled"].includes(status)) {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    });
  }

  await service.updateReservation(reservation_id, { status });

  res.json({
    data: {
      reservation_id,
      status,
    },
  });
}

async function read(req, res, next) {
  const { reservation_id } = req.params;

  const reservation = await service.readReservation(reservation_id);

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} not found`,
    });
  }

  res.json({
    data: reservation,
  });
}

async function update(req, res, next) {
  const { reservation_id } = req.params;
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = req.body.data;

  const reservation = await service.readReservation(reservation_id);

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} not found`,
    });
  }

  if (
    first_name === "" ||
    last_name === "" ||
    mobile_number === "" ||
    reservation_date === "" ||
    reservation_time === "" ||
    people === ""
  ) {
    return next({
      status: 400,
      message: `Missing required field(s)`,
    });
  }

  if (!Number.isInteger(people) || people < 1) {
    return next({
      status: 400,
      message: `Invalid number of people`,
    });
  }

  const updatedReservation = await service.updateReservation(reservation_id, {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  });

  res.json({
    data: updatedReservation,
  });
}

async function create(req, res, next) {
  const {
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = req.body.data;

  if (
    first_name === "" ||
    last_name === "" ||
    mobile_number === "" ||
    reservation_date === "" ||
    reservation_time === "" ||
    people === ""
  ) {
    return next({
      status: 400,
      message: `Missing required field(s)`,
    });
  }

  if (!Number.isInteger(people) || people < 1) {
    return next({
      status: 400,
      message: `Invalid number of people`,
    });
  }

  const newReservation = await service.createReservation({
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  });

  res.status(201).json({
    data: newReservation,
  });
}

async function list(req, res, next) {
  const { date } = req.query;
  const { mobile_number } = req.query;

  if (date) {
    const reservations = await service.listReservationsByDate(date);

    res.json({
      data: reservations,
    });
  } else if (mobile_number) {
    const reservations = await service.searchReservationsByMobileNumber(
      mobile_number
    );

    res.json({
      data: reservations,
    });
  } else {
    const reservations = await service.listReservations();

    res.json({
      data: reservations,
    });
  }
}

module.exports = {
  updateStatus: asyncErrorBoundary(updateStatus),
  read: asyncErrorBoundary(read),
  update: asyncErrorBoundary(update),
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
};
