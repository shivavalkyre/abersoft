const secret = process.env.SECRET_TOKEN_MYROBIN || 'the default secret';
// const request = require('request');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Error handler
const errorHandler = {};
errorHandler.BadRequest = (res, err) => {
    res.status(400).json({ success: 0, message: err });
};
errorHandler.Unauthorized = (res, err) => {
    res.status(401).json({ success: 0, message: err || 'Unauthorized' });
};
errorHandler.NotFound = (res, err) => {
    res.status(404).json({ success: 0, message: err });
};
errorHandler.UnHandler = (res, err) => {
    if (err.name === 'ValidationError')  {
        let errorMessage;
        if (err.details) {
            errorMessage = err.details[0].message;
        } else {
            errorMessage = err.message;
        }

        res.status(400).json({ status: 'error', message: errorMessage });
    } else if (err.code === 'ENOENT') {
        res.status(400).json({ status: 'error', message: err.toString() });
    } else {
        const message = err.toString() || 'Something technically wrong';
        if (err.kind == 'ObjectId') {
            res.status(400).json({ status: 'error', message });
        } else {
            // sendErrorLog(res, err);
            res.status(500).json({ status: 'error', message });
        }
    }
};

// Auth handler
const passportHandler = {
    session: false,
    failureRedirect: '/api/v2/response/fail'
};
const payloadJwt = (user) => ({
    _id: user._id,
    email: user.email,
    accessToken: user.accessToken,
});
const authOpenApi = async (req, res, next) => {
    try {
        const token = req.header('X-MYROBIN-TOKEN');
        const data = jwt.verify(token, secret); // data company
        const [accessToken, company, user] = await Promise.all([
            AccessToken.findOne({
                company_id: data._id,
                token,
                status: 1,
                deleted_at: null
            }),
            Company.findOne({ _id: data._id, is_partner: true, deleted_at: null }),
            User.findOne({ company_id: data._id, deleted_at: null })
        ]);
        if (!accessToken || !company || !user) {
            return errorHandler.Unauthorized(res);
        }
        req.user = user;
        req.company = company;
        next();
    } catch (error) {
        errorHandler.Unauthorized(res);
    }
};

// Javascript handler
const comparePasswordAsync = (param1, param2) => {
    param1 = param1 || "";
    param2 = param2 || "";
    return new Promise((resolve, reject) => {
        bcrypt.compare(param1, param2, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};
const generateBcryptSaltAsync = (data) => { // use in change password
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) reject(err);
            bcrypt.hash(data, salt, async (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
    });
};
const encodeJwtAsync = (payload, secret) => { // use in change password
    return new Promise((resolve, reject) => {
        jwt.sign(payload, secret, (err, token) => { // expires in 30days
            if (err) {
                reject('Error signing token');
            } else {
                resolve(token);
            }
        });
    });
};

// Security handler
const replaceSqlInjection = (data) => {
    data = data || "";
    const pattern = /([^a-z0-9]+)/gi;
    return data.replace(pattern, '');
};



module.exports = {
    errorHandler,
    passportHandler,
    payloadJwt,
};
