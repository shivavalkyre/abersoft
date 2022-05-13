const { errorHandler, payloadJwt } = require('~/services/abersoft-core');
const router = require('express').Router();
const User = require('~/src/databases/models/userModel');
const jwt = require('jsonwebtoken');

var refreshtokens = {};
const crypto = require('crypto');
const moment = require('moment');

// bcrypt config
const bcrypt = require('bcrypt');
const saltRounds = 10;



exports.register =  async (req, res) => {

    //console.log(req.body);
    var obj = req.body;
    //console.log(obj.email);
    //console.log(obj.email);
    //console.log(obj.password);



    try {
        if (!obj.email) {
            return errorHandler.BadRequest(res, 'Email is required');
        }

        const user = await User.findOne({
            $or: [
                { email: obj.email },
                { noPhone: obj.phone }
            ]
        });

        console.log(user);

        if (user) {
            if (user.email === obj.email) {
                return errorHandler.BadRequest(res, 'Email already taken.');
            } else if (user.noPhone === obj.phone) {
                return errorHandler.BadRequest(res, 'Phone already registered');
            } else {
                return errorHandler.BadRequest(res, 'User is exist');
            }
        } else { // register


            bcrypt.genSalt(saltRounds, (err, salt) => {
                if (err) throw err;

                bcrypt.hash(obj.password, salt, async (err, hash) => {
                    if (err) throw err;

                    const resData = {
                        accessToken: crypto.randomBytes(32).toString('Hex'),
                        email: obj.email
                    }
                   
                    const newUser = new User({
                        name: obj.fullname,
                        email: resData.email,
                        password: hash,
                        noPhone: obj.phone,
                        isAdmin:true,
                        accessToken: resData.accessToken,
                    });
                    await newUser.save();

                    const user = await User.findOne({ email: obj.email });
                    const expired = moment().add('3', 'minutes').unix();
                    const payload = payloadJwt(user);
                    const sign = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '180s' });
                    resData.isVerified = !!user.emailVerifiedAt;
                    resData.accessToken = sign;
                    
                    res.json({
                        success: 1,
                        data: resData
                    });
                });
            });
        }
    } catch (err) {
        errorHandler.UnHandler(res, err);
    }
}


exports.login = async (req, res) => {

   var obj = req.body;

    try {
        if (!obj.email) {
            return errorHandler.BadRequest(res, 'Email is required');
        }
        if (!obj.password) {
            return errorHandler.BadRequest(res, 'Password is empty');
        }

        var email = obj.email;

        const user = await User.findOne({ 'email': obj.email });

        if (user) {
            
            var userID = user._id;
            var emailVerifiedAt = user.emailVerifiedAt;
            var isVerified;
            var user_password =  user.password;

            if (emailVerifiedAt == null) {
                isVerified = false;
            } else if (emailVerifiedAt !== null) {
                isVerified = true;
            }

            
            bcrypt.compare(obj.password, user_password, function (err1, res1) {
            //console.log(res1);

                if (res1) {
                    // generate access token

                    var accessToken = crypto.randomBytes(32).toString('Hex');
                    var sign = jwt.sign({ userID, accessToken, email }, process.env.SECRET_KEY, { expiresIn: '30s' });

                    //update to mongo
                    User.findOneAndUpdate({ "email": email }, { "$set": { "accessToken": accessToken } }).exec(function (err, user) {
                        if (err) {
                            //console.log(err);
                            res.status(500).send(err);
                        }
                    });
                    // await User.updateOne({ email : email }, { accessToken:access_token, refreshToken:refresh_token, updatedAt:update_at }, options, callback);

                    res.json({ success: 1, data: { accessToken: sign, email: email, isVerified: isVerified } });


                } else {
                    return errorHandler.BadRequest(res, 'Your password is wrong');
                }

            })
        } else {
            return errorHandler.BadRequest(res, 'Email not registered');
        }

    } catch (err) {
        errorHandler.UnHandler(res, err);
    }

}


exports.logout = async (req, res) => {

  
    try {


        const user = await User.findOne({ 'isAdmin': true });

        if (user) {
            //console.log(user);
            var userID = user._id;
            var emailVerifiedAt = user.emailVerifiedAt;
            var isVerified;

            if (emailVerifiedAt == null) {
                isVerified = false;
            } else if (emailVerifiedAt !== null) {
                isVerified = true;
            }


           
                    var accessToken = null;

                    //update to mongo
                    User.findOneAndUpdate({ "isAdmin": true }, { "$set": { "accessToken": accessToken } }).exec(function (err, user) {
                        if (err) {
                            //console.log(err);
                            res.status(500).send(err);
                        }
                    });
                    // await User.updateOne({ email : email }, { accessToken:access_token, refreshToken:refresh_token, updatedAt:update_at }, options, callback);

                    res.json({ success: 1, data: 'Logout Success' });


        } else {
                    return errorHandler.BadRequest(res, 'User not found');
        }

          
       

    } catch (err) {
        errorHandler.UnHandler(res, err);
    }

}

exports.change_password = async (req, res) => {

    var obj = req.body;
    var email = obj.email;
    var password = obj.newPassword;
    var retypeNewPassword = obj.retypeNewPassword;

    var token = req.headers.authorization;
    var result = token.substr(7,token.length-7);
    //console.log(result);

    try {
        if (!email) {
            return errorHandler.BadRequest(res, 'Email is required');
        }
        if (!password) {
            return errorHandler.BadRequest(res, 'Password is empty');
        }

        if (!retypeNewPassword) {
            return errorHandler.BadRequest(res, 'retypeNewPassword is empty');
        }

        if (password===retypeNewPassword)
        {
            const user = await User.findOne({ 'email': email });

            if (user) {
                var userID = user._id;
                var accessToken = user.accessToken;
                var email = user.email;
                var phone = user.noPhone;
                //console.log(accessToken);
    
                if (!accessToken)
                {
                    return errorHandler.BadRequest(res, 'token not valid');
                }else{
                     // check token is expired


                     try {
                        const decodeSign = jwt.verify(result, process.env.SECRET_KEY);
                        //console.log(decodeSign);
                        try {
                            bcrypt.genSalt(saltRounds, (err, salt) => {
                                if (err) throw err;
                                //console.log('salt:',salt);
    
                                bcrypt.hash(password, salt, async (err1, hash) => {
                                if (err1) throw err1;
                                //console.log(hash);
                                User.findOneAndUpdate({ "email": email }, { "$set": { "password": hash } }).exec(function (err, user) {
                                if (err) {
                                    //console.log(err);
                                    res.status(500).send(err);
                                }
                            });
    
                                res.json({ success: 1, data: 'Password was changed' });
    
                                })
                            })
                        
                        } catch(err) {
                            // err
                            errorHandler.UnHandler(res, err);
                        }
    
                      
    
                      } catch(err) {
                        // err
                        errorHandler.UnHandler(res, err);
                      }
                
              
                }
            }else {
                return errorHandler.BadRequest(res, 'User not found');
            }
        }else{
            return errorHandler.BadRequest(res, 'password not same');
        }

       

    }catch (err)
    {
        errorHandler.UnHandler(res, err);
    }

}

exports.profile =  async (req, res) => {
    var token = req.headers.authorization;
    var result = token.substr(7,token.length-7);
    //console.log(result);

    try {

        //check token
        const user = await User.findOne({ 'isAdmin': true });

        if (user) {
            
            var userID = user._id;
            var accessToken = user.accessToken;
            var email = user.email;
            var phone = user.noPhone;
            //console.log(accessToken);

            if (!accessToken)
            {
                return errorHandler.BadRequest(res, 'token not valid');
            }else{
                // check token is expired

               
                try {
                    const decodeSign = jwt.verify(result, process.env.SECRET_KEY);
                    //console.log(decodeSign);
                    var CurrentDate = moment().unix();
                    //console.log('Current: ',CurrentDate)

                    var emailVerifiedAt = user.emailVerifiedAt;
                    var isVerified;
        
                    if (emailVerifiedAt == null) {
                        isVerified = false;
                    } else if (emailVerifiedAt !== null) {
                        isVerified = true;
                    }

                    res.json({ success: 1, data: { email: email, phone:phone , isVerified: isVerified } });

                  } catch(err) {
                    // err
                    errorHandler.UnHandler(res, err);
                  }
            }
          
        }
    }catch(err)
    {
        errorHandler.UnHandler(res, err);
    }

}



