const t = require('tape-catch')
const {
  TerminalCardMove,
  TerminalCardType,
  NotFoundTerminalCardMove,
  Team,
  InvalidMoveError
} = require('..')
const helpers = require('./helpers')
const { setup } = helpers

t.test("404 not found terminal card", t => {

  t.test("does not swap", t => {
    const game = setup([[4], [4]])
    const { getSquare, doMove } = helpers(game)

    let d2 = getSquare('D2')
    let e2 = getSquare('E2')
    let cardA = d2.card
    let cardB = e2.card

    doMove(new NotFoundTerminalCardMove({
      source: d2,
      other: e2,
      team: Team.bottom
    }))

    t.equals(d2.card, cardA)
    t.equals(e2.card, cardB)

    doMove('A8D')

    t.throws(() => {
      doMove(new NotFoundTerminalCardMove({
        source: d2,
        other: e2,
        team: Team.bottom
      }))
    }, InvalidMoveError, "can't use again")

    t.end()
  })

  t.test("swaps", t => {
    const game = setup([[4], [4]])
    const { getSquare, doMove } = helpers(game)

    let d2 = getSquare('D2')
    let e2 = getSquare('E2')
    let cardA = d2.card
    let cardB = e2.card

    doMove(new NotFoundTerminalCardMove({
      source: d2,
      other: e2,
      team: Team.bottom,
      swap: true
    }))

    t.equals(d2.card, cardB)
    t.equals(e2.card, cardA)

    t.end()
  })

  t.test("swaps (auto team)", t => {
    const game = setup([[4], [4]])
    const { getSquare, doMove } = helpers(game)

    let d2 = getSquare('D2')
    let e2 = getSquare('E2')
    let cardA = d2.card
    let cardB = e2.card

    doMove(new NotFoundTerminalCardMove({
      source: d2,
      other: e2,
      swap: true
    }))

    t.equals(d2.card, cardB)
    t.equals(e2.card, cardA)

    t.end()
  })

  t.test("can't specify empty squares for auto-team", t => {
    const game = setup([[4], [4]])
    const { getSquare, doMove } = helpers(game)

    const d2 = getSquare('D2')
    const h5 = getSquare('H5')

    t.throws(() => {
      doMove(new NotFoundTerminalCardMove({
        source: d2,
        other: h5,
        team: Team.bottom
      }))
    }, InvalidMoveError)

    t.throws(() => {
      doMove(new NotFoundTerminalCardMove({
        source: h5,
        other: d2,
        team: Team.bottom
      }))
    }, InvalidMoveError)

    t.end()
  })

  t.test("can't swap with enemy card", t => {
    const game = setup([[4], [4]])
    const { getSquare, doMove } = helpers(game)

    let d2 = getSquare('D2')
    let d7 = getSquare('D7')

    t.throws(() => {
      doMove(new NotFoundTerminalCardMove({
        source: d2,
        other: d7,
        team: Team.bottom
      }))
    }, InvalidMoveError)

    t.end()
  })

  t.end()
})

t.test("404 not found + virus check (no swap)", t => {
  const game = setup([[4], [4]])
  const { getSquare, doMove } = helpers(game)

  const d2 = getSquare('D2')
  const e2 = getSquare('E2')
  const cardA = d2.card
  const cardB = e2.card

  doMove(new TerminalCardMove({
    cardType: TerminalCardType.virusCheck,
    team: Team.top,
    source: d2
  }))

  doMove(new NotFoundTerminalCardMove({
    team: Team.bottom,
    source: d2,
    other: e2,
    swap: false
  }))

  t.equals(d2.card, cardA)
  t.equals(e2.card, cardB)
  t.notOk(cardA.revealed, "should not be revealed")

  t.end()
})

t.test("404 not found + virus check (swap)", t => {
  const game = setup([[4], [4]])
  const { getSquare, doMove } = helpers(game)

  const d2 = getSquare('D2')
  const e2 = getSquare('E2')
  const cardA = d2.card
  const cardB = e2.card

  doMove(new TerminalCardMove({
    cardType: TerminalCardType.virusCheck,
    team: Team.top,
    source: d2
  }))

  doMove(new NotFoundTerminalCardMove({
    team: Team.bottom,
    source: d2,
    other: e2,
    swap: true
  }))

  t.equals(d2.card, cardB)
  t.equals(e2.card, cardA)
  t.notOk(cardA.revealed, "should not be revealed")

  t.end()
})

t.test("404 not found + line boost", t => {
  const game = setup([[4], [4]])
  const { getSquare, doMove, install } = helpers(game)

  const d2 = getSquare('D2')
  const e2 = getSquare('E2')
  const cardA = d2.card
  const cardB = e2.card

  install('lineBoost', 'bottom', 'D2')

  doMove('A8D')

  doMove(new NotFoundTerminalCardMove({
    source: d2,
    other: e2,
    team: Team.bottom,
    swap: true
  }))

  t.notOk(cardA.lineBoosted)
  t.ok(cardB.lineBoosted)
  t.equals(
    game.state.terminalCardState
      .get(Team.bottom).get(TerminalCardType.lineBoost),
    d2
  )

  t.end()
})
