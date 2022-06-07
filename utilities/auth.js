const jsonWebToken = require("jsonwebtoken")

function generateToken(userInfo) {
    if (!userInfo) {
        return null
    }

    return jsonWebToken.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '1h'
    }) 
}

function verifyToken(username, token) {
    return jsonWebToken.verify(token, process.env.JWT_SECRET, (error, response) => {
        if (error) {
            return {
                verified: false,
                message: 'Invalid Token'
            }
        }
        
        if (response.username !== username) {
            return {
                verified: false,
                message: 'Invalid User'
            }
        }

        return {
            verified: true,
            message: 'verified'
        }
    })
}

module.exports.generateToken = generateToken
module.exports.verifyToken = verifyToken