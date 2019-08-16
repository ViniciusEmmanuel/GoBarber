const { Op } = require('sequelize');
const { startOfDay, endOfDay, parseISO } = require('date-fns');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const File = require('../models/File');

class SheduleController {
  async index(req, res) {
    const { page = 1, date } = req.query;
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário não é prestadore de serviço!!!. ' });
    }

    const parsedDate = parseISO(date);

    const appointment = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointment);
  }
}

module.exports = new SheduleController();
