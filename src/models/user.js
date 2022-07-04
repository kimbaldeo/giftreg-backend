/**
 * User Object
 * @param {string} name 
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 * @param {string} wishlistID 
 * @returns {User}
 */
function User(name, username, email, password, wishlistID) {
    var user = {};
    user.name = name;
    user.username = username;
    user.email = email;
    user.password = password;
    user.wishlistID = wishlistID;

    return user;
}

module.exports.User = User;