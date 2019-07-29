const User = require('../models/User');
const Notication = require('../schemas/Notification');

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Usuário logado não é Barbeiro!!!.' });
    }

    const notication = await Notication.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notication);
  }

  async update(req, res) {
    const notification = await Notication.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

module.exports = new NotificationController();
