const Yup = require('yup');
const User = require('../models/User');
const DaysWork = require('../models/DaysWorkProvider');
const Days = require('../models/Days');

class ProviderAdminController {
  async index(req, res) {
    const data = await User.findAll({ where: { id: req.userId } });

    res.json(data);
  }

  async store(req, res) {
    const user = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!user) {
      return res.status(400).json({ error: 'Acesso não autorizado!!!.' });
    }

    const schema = Yup.object().shape({
      day: Yup.number().required(),
      hour_start: Yup.string()
        .required()
        .min(5)
        .max(5),
      hour_break: Yup.string()
        .required()
        .min(5)
        .max(5),
      hour_restart: Yup.string()
        .required()
        .min(5)
        .max(5),
      hour_end: Yup.string()
        .required()
        .min(5)
        .max(5),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Dados inválidos!!!.' });
    }

    const { day, hour_start, hour_break, hour_restart, hour_end } = req.body;

    const isValidDay = await Days.findByPk(day);

    if (!isValidDay) {
      return res.json({ error: 'Dia inválido!!!.' });
    }

    const isValidDayWeek = await DaysWork.findOne({
      where: { provider_id: req.userId, day_id: day },
    });

    if (isValidDayWeek) {
      return res.json({ error: 'Dia já cadastrado!!!.' });
    }

    const dia = await DaysWork.create({
      provider_id: req.userId,
      day_id: day,
      hour_start,
      hour_break,
      hour_restart,
      hour_end,
    });

    return res.json(dia);
  }
}

module.exports = new ProviderAdminController();
