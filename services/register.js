const util = require('../utilities/util')
const bcrypt = require('bcryptjs')

const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient()
const userTable = 'gift.user';
// const bodyParser = require('body-parser');

async function register(userInfo) {
    const name = userInfo.name
    const email = userInfo.email
    const username = userInfo.username
    const password = userInfo.password

    if (!username || !namme || !email || !password) {
        return util.buildResponse(401, {
            message: 'All fields are required'
        })
    }

    const dynamoUser = await getUser(username.toLowerCase().trim())
    if (dynamoUser && dynamoUser.username) {
        return util.buildResponse(40, {
            message: 'This username is already in use. Please choose a differnt username'
        })
    }

    const encryptedPW = bcrypt.hashSync(password.trim(), 10)
    const user = {
        name: name,
        email: email,
        username: username.toLowerCase().trim(),
        password: encryptedPW
    }

    const saveUserResponse = await saveUser(user)
    if (!saveUserResponse) {
        return util.buildResponse(503, {
            message: 'Server error, try again later'
        })
    }

    return util.buildResponse(200, {username: username})
}

async function getUser(username) {
    const params = {
        TableName: userTable,
        Key: {
            username: username
        }
    }

    return await dynamodb.get(params).promise().then(response => {
        return response.Item
    }, error => {
        console.error('There was an error: ', error)
    })
}

async function saveUser(user) {
    const params = {
        TableName: userTable;
        Item: user
    }

    return await dynamodb.put(params).promise().then(() => {
        return true
    }, error => {
        console.error('There is an error saving user: ', error)
    })
}