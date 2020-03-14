const {RequestHandler} = require('express');
const {JWT_SECRET} = require('../utils');
const jwt = require('jsonwebtoken');

const exctractJwtMidlleware = () => {
    return (req, res, next) => {
        let authorization = req.get('authorization');
        let token =  authorization ? authorization.splite(' ')[1]: undefined;

        req['context'] = {};
        req['context']['authorization'] = authorization;

        if (!token) {return next();}

        jwt.verify(token, JWT_SECRET, (err, decoded) => {

            if (err) {return next();}

        })



    }
}
module.exports = exctractJwtMidlleware()