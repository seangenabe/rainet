const Enum = require('symbol-enum')

/**
 * The types of an online card.
 * @var {external:SymbolEnum} OnlineCardType
 * @kind constant
 * @property {Symbol} link Link card
 * @property {Symbol} virus Virus card
 */
const OnlineCardType = new Enum('link', 'virus')

module.exports = OnlineCardType
