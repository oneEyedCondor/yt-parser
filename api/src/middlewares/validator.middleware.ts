import createHttpError from 'http-errors';

import validators from '../validators';

const validatorMiddleware = (validator) => {
    if (!validators.hasOwnProperty(validator))
        throw new Error(`'${validator}' validator is not exist`);

    return async function (req, res, next) {
        try {
            const validated = await validators[validator].validateAsync(
                req.body
            );
            req.body = validated;
            next();
        } catch (err) {
            if (err.isJoi)
                return next(createHttpError(422, { message: err.message }));
            next(createHttpError(500));
        }
    };
};

export default validatorMiddleware;
