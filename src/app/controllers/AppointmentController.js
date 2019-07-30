const Yup = require('yup');
const {
  startOfHour,
  parseISO,
  isBefore,
  format,
  subHours,
} = require('date-fns');
const pt = require('date-fns/locale/pt-BR');
const User = require('../models/User');
const File = require('../models/File');
const Appointment = require('../models/Appointment');
const Notification = require('../schemas/Notification');
const Mail = require('../../lib/Mail');

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

    if (req.userId == provider_id) {
      return res.status(401).json({
        error: 'Ação invalida. Usuàrio igual ao Barbeiro Selecionado!!!.',
      });
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

    /**
     * Notify appointment provider
     */

    const user = await User.findByPk(req.userId);

    const formatedDate = format(hourStart, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formatedDate}`,
      user: provider_id,
    });
    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: 'Usuàrio diferente do agendamento!!!.' });
    }

    const dateSub = subHours(appointment.date, 2);

    if (isBefore(dateSub, new Date())) {
      return res.status(401).json({
        error:
          'Ação inválida. Cancelamento somente com mais de duas horas de antecedencia!!!.',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "'dia' dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });

    return res.json(appointment);
  }
}

module.exports = new AppointmentController();
