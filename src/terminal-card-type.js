'use strict'

const Enum = require('symbol-enum')

/**
 * Distinguishes among Terminal Cards.
 * @var {external:SymbolEnum} TerminalCardType
 * @kind constant
 * @property {Symbol} lineBoost Line Boosts
 * @property {Symbol} firewall Firewall
 * @property {Symbol} notFound 404 Not Found
 * @property {Symbol} virusCheck Virus Check
 */
module.exports = new Enum(
  'lineBoost',
  'firewall',
  'notFound',
  'virusCheck'
)
