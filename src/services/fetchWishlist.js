const databaseUtil = require('../utilities/database');
const util = require('../utilities/responseBuilder');

/**
 * Fetch Wishlist From DB Service
 * @param {JSON} wishlistInfo
 * @returns {Response}
 */
async function fetchWishlist(wishlistInfo) {
    // get user to get wishlist id
    // use wishlist id from user to access wishlist
    const wishlistID = wishlistInfo.wishlist_id;
    const wishlist = await databaseUtil.getWishlist(wishlistID);
    if (!wishlist) {
        return util.buildResponse(503, { message: 'Cannot access wishlist' });
    }
    const items = fetchItems(wishlist);
    return util.buildResponse(200, {wishlistItems: items})
}

/**
 * Fetch the Item Info for a given Wishlist
 * @param {Wishlist} wishlist 
 * @returns {Item[]}
 */
function fetchItems(wishlist) {
    let items = [];
    for(let i = 0; i < wishlist.items.length; i++) {
        itemID = wishlist.items[i];
        const itemResponse = await databaseUtil.getItem(itemID);
        if (!itemResponse) {
            return util.buildResponse(503, { message: 'Server Error. Please try again later. Cannot access items in wishlist'});
        }
        items.push(itemResponse);
    }
    return items;
}

module.exports.fetchWishlist = fetchWishlist;