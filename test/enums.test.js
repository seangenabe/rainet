const t = require('tape-catch')
const {
  Direction,
  StackCause,
  Team,
  TerminalCardType
} = require('..')

let enums = [
  [Direction, ['up', 'down', 'left', 'right']],
  [StackCause, ['infiltrated', 'captured']],
  [Team, ['top', 'bottom']],
  [TerminalCardType, ['lineBoost', 'firewall', 'notFound', 'virusCheck']]
]

t.test('enums', t => {
  for (let [enumType, keys] of enums) {
    for (let key of keys) {
      t.equals(enumType[enumType[key]], key)
    }
  }
  t.end()
})
