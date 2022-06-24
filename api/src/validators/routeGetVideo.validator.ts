import Joi from 'joi';

export default Joi.object({
    link: Joi.string().uri().required(),
});
