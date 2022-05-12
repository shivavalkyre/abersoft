const Joi = require('joi');

const joiVaidate = {
    register: Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().min(6).required(),
        confirm_password: Joi.any().valid(Joi.ref('password')).required().error(errors => {
            errors.forEach(err => {
                // console.log(err.code)
                if (err.code === "any.only") {
                    err.message = "Password should be same!";
                } else {
                }
            });
            return errors;
        }),
        name: Joi.string().min(6).required(),
        phone: Joi.string().min(6).required()
    }).options({ allowUnknown: false }),
};

module.exports = joiVaidate;
