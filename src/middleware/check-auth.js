const jwt = require('jsonwebtoken')
const { errorHandler } = require('~/services/abersoft-core');
const UsersModel = require('~/src/databases/models/userModel');

module.exports = async (req, res, next) => {

    try {
        // VARIABLE
        const token = req.headers.authorization
        var result = token.substr(7,token.length-7);

        // DECODE TOKEN
        const decoded = jwt.verify(result, process.env.SECRET_KEY);
        //console.log(decoded);
        // FIND USER
        const user = await UsersModel.findOne({ email: decoded.email });

        // CHECK ACCESSTOKEN
        if (user.accessToken === decoded.accessToken) {
            req.userData = jwt.verify(result, process.env.SECRET_KEY);
            next();
        } else {
            errorHandler.Unauthorized(res, "PLEASE LOG IN FIRST.")
        }

    } catch (error) {
        let err
        if (error.message) {
            err = error.message;
        } else {
            err = "PLEASE LOG IN FIRST."
        }
        errorHandler.Unauthorized(res, err)
    }
}