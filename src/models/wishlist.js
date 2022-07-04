/**
 * Wishlist Object
 * @param {string} id 
 * @param {string[]} items 
 * @returns {Wishlist}
 */
function Wishlist(id, items) {
    var wishlist = {};
    wishlist.id = id;
    wishlist.items = items;

    return wishlist;
}

module.exports.Wishlist = Wishlist;