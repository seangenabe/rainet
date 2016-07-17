const Util = require('util')

class TypeCheck {

  constructor() {
    this._assertions = []
    this._keys = []
  }

  get nullable() {
    this._nullable = true
    return this
  }

  get integer() {
    this._assertions.push({
      fn: x => Number.isInteger(x),
      message: `Value must be an integer.`
    })
    return this
  }

  get object() {
    this._assertions.push({
      fn: x => typeof x === 'object',
      message: `Value must be an object.`
    })
    return this
  }

  between(min, max) {
    this._assertions.push({
      fn: x => min <= x && x <= max,
      message: `Value must be between ${min} and ${max}, inclusive.`
    })
    return this
  }

  enum(enumType, enumTypeName) {
    this._assertions.push({
      fn: x => enumType.hasValue(x),
      message: `Value must be a value of ${enumTypeName || 'Enum'}.`
    })
    return this
  }

  instanceof(type) {
    this._assertions.push({
      fn: x => x instanceof type,
      message: `Value must be an instance of ${type.constructor.name}.`
    })
    return this
  }

  assert(value, desc) {
    if (this._nullable) {
      if (value == null) { return }
    }
    for (let assertion of this._assertions) {
      if (!assertion.fn(value)) {
        throw new TypeError(
          `${assertion.message} Description: ${desc}; got ${Util.inspect(value)}`
        )
      }
    }
  }

}

module.exports = () => new TypeCheck()
