// app/middleware/metrics.js
const { Op } = require("sequelize");

const dateFromToFilter = async (req, res, next) => {
    // checking if optional date filters are in the query string
    const from = req.query.from ? req.query.from : undefined;
    const to = req.query.to ? req.query.to : undefined;
    // constructing optional date filter
    var filter = { from_name: { [Op.ne]: 'Bot Connect' } };
    filter[Op.and] = []
    if (from) {
        filter[Op.and].push({ created_at: { [Op.gte]: from} });
    }
    if (to) {
        filter[Op.and].push({ created_at: { [Op.lte]: to } });
    }
    req.dateFromToFilter = filter;
    next();
}

module.exports = {
    dateFromToFilter
};
