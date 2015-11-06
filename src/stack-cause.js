'use strict'

const Enum = require('symbol-enum')

/**
 * Reasons why a card is stacked in the stack area.
 * @var {external:SymbolEnum} StackCause
 * @kind constant
 * @property {Symbol} infiltrated Online card infiltrated server
 * @property {Symbol} captured Online card was captured by the enemy
 */
module.exports = new Enum('infiltrated', 'captured')
