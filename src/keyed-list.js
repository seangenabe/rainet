/**
 * Initializes a new instance of KeyedList.
 * @classdesc An ordered list of objects, each with a key.
 */
// Hint: Keys can be anonymized with `Symbol()`.
module.exports = class KeyedList {

  constructor() {
    this._order = new FastLookupList()
    this._objects = new Map()
  }

  push(key, obj) {
    this._order.push(key)
    this._objects.set(key, obj)
  }

  unshift(key, obj) {
    this._order.unshift(key)
    this._objects.set(key, obj)
  }

  insertBefore(key, objKey, obj) {
    let i = this._order.indexOf(key)
    /* istanbul ignore if */
    if (i === -1) {
      throw new Error(`Key not found: ${key}. Available keys: ${this._order}`)
    }
    this._order.splice(i, 0, objKey)
    this._objects.set(objKey, obj)
  }

  insertAfter(key, objKey, obj) {
    let i = this._order.indexOf(key)
    /* istanbul ignore if */
    if (i === -1) {
      throw new Error(`Key not found: ${key}. Available keys: ${this._order}`)
    }
    this._order.splice(i + 1, 0, objKey)
    this._objects.set(objKey, obj)
  }

  *[Symbol.iterator]() {
    for (let key of this._order) {
      yield this._objects.get(key)
    }
  }

}

// Fast, add-only version of Array that optimizes indexOf by
// using symbols as proxies to the contents.
class FastLookupList {

  constructor() {
    this._map = new Map()
    this._rmap = new Map()
    this._order = []
  }

  _create(obj) {
    let s = Symbol()
    this._map.set(obj, s)
    this._rmap.set(s, obj)
    return s
  }

  push(obj) {
    this._order.push(this._create(obj))
  }

  unshift(obj) {
    this._order.unshift(this._create(obj))
  }

  splice(start, del, newObj) {
    this._order.splice(start, del, this._create(newObj))
  }

  indexOf(obj) {
    if (!this._map.has(obj)) {
      return -1
    }
    let sym = this._map.get(obj)
    return this._order.indexOf(sym)
  }

  *[Symbol.iterator]() {
    for (let sym of this._order) {
      yield this._rmap.get(sym)
    }
  }

}
