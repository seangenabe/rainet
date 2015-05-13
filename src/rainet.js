
// The main namespace.
// All classes are available for access under this object keyed by class name.

/**
 * @namespace
 */
var RaiNet = {}

var files = [
  'board',
  'card',
  'direction',
  'game',
  'game-state',
  ['get-enemy-team', 'function'],
  'grid',
  'installable-terminal-card-move',
  'invalid-move-error',
  'location',
  'move',
  'not-found-terminal-card-move',
  'online-card-move',
  'online-card-type',
  'square',
  'stack-cause',
  'stacked-online-card',
  'team',
  'terminal-card-move',
  'terminal-card-type'
]

for (let descriptor of files) {
  descriptor = [].concat(descriptor)
  let [filename, type] = descriptor
  let propertyNameArray = filename.split('-')
  let startingIndex = (type === 'function') ? 1 : 0
  let propertyName = propertyNameArray.map((value, index) => {
    if (index >= startingIndex) {
      value = value.substr(0, 1).toUpperCase() + value.substr(1)
    }
    return value
  }).join('')

  Object.defineProperty(RaiNet, propertyName, {
    enumerable: true,
    get: function() {
      return require('./' + filename)
    }
  })
}

module.exports = RaiNet
