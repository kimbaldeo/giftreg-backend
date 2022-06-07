const jsonWebToken = require("jsonwebtoken")

const = require('jsonwebtoken')

function generateToken(userInfo) {
    if (!userInfo) {
        return null
    }

    return jsonWebToken.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '1h'
    }) 
}

module.exports.generateToken = generateToken