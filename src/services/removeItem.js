const database = require('../utilities/database');
const util = require('../utilities/responseBuilder');

/**
 * Remove Item From Wishlist Service
 * @param {JSON} wishlistInfo 
 * @returns {Response}
 */
async function removeItem(wishlistInfo) {
    const wishlistID = wishlistInfo.wishlist_id;
    const itemID = wishlistInfo.item_id;

    const wishlist = await database.getWishlist(wishlistID);
    if (!wishlist) {
        return util.buildResponse(503, { message: 'Cannot access wishlist' });
    }

    const updatedWishlistItems = wishlist.items.filter(function(value) {
        return value != itemID;
    });

    wishlist.items = updatedWishlistItems;

    const saveWishlistResponse = await database.saveWishlist(wishlist);
    if (!saveWishlistResponse) {
        return util.buildResponse(503, { message: 'Server Error, could not save updated wishlist. Please try again later.'});
    }
    return util.buildResponse(200, { wishlist: wishlist });
}

module.exports.removeItem = removeItem;