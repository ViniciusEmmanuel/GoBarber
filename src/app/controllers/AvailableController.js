const { Op } = require('sequelize');
const { startOfDay, endOfDay } = require('date-fns');
const User = require('../models/User');
const File = require('../models/File');
const Appointment = require('../models/Appointment');

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data inválida!!!.' });
    }

    const { providerId } = req.params;

    // Recebe a data no formato timestamp
    const searchDate = Number(date);

    const appointment = await Appointment.findAll({
      where: {
        provider_id: providerId,
        canceled_at: null,
        date: { [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)] },
      },
      attributes: ['id', 'date', 'user_id', 'provider_id'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
          include: [{ model: File, as: 'avatar', attributes: ['id', 'url'] }],
        },
      ],
    });

    return res.json(appointment);
  }
}

module.exports = new AvailableController();
