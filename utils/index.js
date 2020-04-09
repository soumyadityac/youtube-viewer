const _once = require('lodash/once')

const logger = require('./logger');
const isProduction = _once(() => process.env.NODE_ENV === 'production');

module.exports = { logger, isProduction };