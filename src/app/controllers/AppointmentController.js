const Yup = require('yup');
const { startOfHour, parseISO, isBefore } = require('date-fns');
const User = require('../models/User');
const File = require('../models/File');
const Appointment = require('../models/Appointment');

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointment = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'provider'],
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

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Valores inválidos!!!.' });
    }
    const { provider_id, date } = req.body;

    /**
     *  Check if provider_id is a provider
     */

    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário selecionado não é Barbeiro!!!.' });
    }

    const hourStart = startOfHour(parseISO(date));

    /**
     * Checked date informed user
     */
    if (isBefore(hourStart, new Date())) {
      return res
        .status(400)
        .json({ error: 'Data ultrapassada. Favor informe outra data!!!.' });
    }

    /**
     * Checked date is valid
     */

    const checkDateValidAppointment = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkDateValidAppointment) {
      return res
        .status(400)
        .json({ erro: 'Data informada não disponivel!!!. ' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date,
    });

    return res.json(appointment);
  }
}

module.exports = new AppointmentController();
