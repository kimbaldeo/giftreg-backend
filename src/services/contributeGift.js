const database = require('../utilities/database');
const util = require('../utilities/responseBuilder');

async function contribute(giftInfo) {
    const itemID = giftInfo.item_id;
    const giftAmount = parseFloat(giftInfo.amount);

    const item = await database.getItem(itemID);
    if (!item) {
        return util.buildResponse(404, { message: 'Item Not Found' });
    }

    const contributions = parseFloat(item.contributions);
    const total = contributions + giftAmount;

    item.contributions = total.toString();

    const saveItemResponse = await database.saveItem(item);
    if (!saveItemResponse) {
        return util.buildResponse(503, { message: 'Could Not Update Item with gift contribution. Please Try Again Later' });
    }
    return util.buildResponse(200, { item: item, message: 'Gift Contribution Saved!' });
}

module.exports.contribute = contribute;