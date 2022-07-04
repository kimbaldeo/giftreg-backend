/**
 * Item Object
 * @param {string} id 
 * @param {string} url 
 * @param {string} name 
 * @param {string} image 
 * @param {string} message 
 * @param {number} price 
 * @param {number} contributions 
 * @returns {Item}
 */
function Item(id, url, name, image, message, price, contributions) {
    var item = {};
    item.id = id;
    item.url = url;
    item.name = name;
    item.image = image;
    item.message = message;
    item.price = price;
    item.contributions = contributions;

    return item;
}

module.exports.Item = Item;