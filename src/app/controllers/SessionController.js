const jwt = require('jsonwebtoken');
const Yup = require('yup');
const User = require('../models/User');
const authConfig = require('../../config/auth');

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Valores incorretos ou faltando. Verifique!!!.' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha invalida!!!.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Usuário ou senha invalida!!!.' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();
