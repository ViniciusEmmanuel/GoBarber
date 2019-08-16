const { Op } = require('sequelize');
const { startOfDay, endOfDay } = require('date-fns');
const Appointment = require('../models/Appointment');
const DaysWork = require('../models/DaysWorkProvider');
const Days = require('../models/Days');
const hours = require('../util/calcHours');

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data inválida!!!.' });
    }

    const provider_id = req.params.providerId;

    // Recebe a data no formato timestamp
    const searchDate = Number(date);

    const numberDay = new Date(searchDate).getDay();

    const [
      { hour_start, hour_break, hour_restart, hour_end },
    ] = await DaysWork.findAll({
      where: {
        provider_id,
      },
      include: [
        {
          model: Days,
          as: 'day',
          where: { numberDay },
          attributes: [],
        },
      ],
      attributes: ['hour_start', 'hour_break', 'hour_restart', 'hour_end'],
    });

    const appointment = await Appointment.findAll({
      where: {
        provider_id,
        canceled_at: null,
        date: { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] },
      },
      attributes: ['date'],
    });

    const hour = hours(
      appointment,
      hour_start,
      hour_break,
      hour_restart,
      hour_end
    );
    return res.json(hour);
  }
}

module.exports = new AvailableController();
