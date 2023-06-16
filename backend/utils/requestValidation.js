const { celebrate, Joi } = require('celebrate');

const urlRegExp = /^https?:\/\/(www.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*#?$/;

module.exports.validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
      }),
    about: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "about" - 2',
        'string.max': 'Максимальная длина поля "about" - 30',
      }),
  }),
});

module.exports.validateUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegExp)
      .message('Поле "avatar" должно быть валидным url-адресом')
      .messages({ 'string.empty': 'Поле "link" должно быть заполнено' }),
  }),
});

module.exports.validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Минимальная длина поля "name" - 2',
        'string.max': 'Максимальная длина поля "name" - 30',
        'string.empty': 'Поле "name" должно быть заполнено',
      }),
    link: Joi.string().required().pattern(urlRegExp)
      .message('Поле "link" должно быть валидным url-адресом')
      .messages({ 'string.empty': 'Поле "link" должно быть заполнено' }),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({ cardId: Joi.string().required().hex().length(24) }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({ userId: Joi.string().required().hex().length(24) }),
});
