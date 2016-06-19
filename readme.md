# rainet

RaiNet Access Battlers Javascript implementation

[![npm](https://img.shields.io/npm/v/symbol-enum.svg?style=flat-square)]
[![Dependency Status](https://img.shields.io/david/seangenabe/symbol-enum.svg?style=flat-square)](https://david-dm.org/seangenabe/symbol-enum)
[![devDependency Status](https://img.shields.io/david/dev/seangenabe/symbol-enum.svg?style=flat-square)](https://david-dm.org/seangenabe/symbol-enum#info=devDependencies)
[![node](https://img.shields.io/node/v/symbol-enum.svg?style=flat-square)](https://nodejs.org/en/download/)

## Example usage

### Creating game instances

```javascript
// Create a game.
let game = new Game()
```

The game will be created with some initial state, provided at `game.state`. This object can be read to query the state of the game at any time.

### Starting a game

Terminology: Here "team" is used to indicate the playing sides of the game, even if there is only one player in each.

Enums are provided by the `symbol-enum` module.

To start the game, pass an object to `game.start()`:
* `startingTeam`: Starting team. Can be unspecified, in which case any player can make the first move.
* `arrangement`: Map. Arrangement for each team.

#### Arrangement array format

The arrangement array is an array of numbers which is simply the number of link cards to put before each virus card.

Examples:
* LVLVLVLV = [1, 1, 1, 1]
* VLVLVLVL = [0, 1, 1, 1] : the remaining card is inferred
* LLLLVVVV = [4, 0, 0, 0] = [4] : remaining cards are inferred
* LLVVVVLL = [2, 0, 0, 0] = [2]
* VVVVLLLL = [0, 0, 0, 0] = [] : there are no link cards before any virus card

#### Example

```javascript
game.start({
  startingTeam: Team.bottom,
  arrangement: new Map([
    [Team.top, [1, 2, 0, 1]],
    [Team.bottom, [4]]
  ])
})
```

### Querying game state

#### Terminal card state

Example:
```javascript
game.state.terminalCardState.get(Team.bottom).get(TerminalCardType.virusCheck) // boolean
{
  let sq = game.state.terminalCardState.get(Team.bottom)
    .get(TerminalCardType.lineBoost) // Square if installed
  sq.location // Location
  sq.card // Card if there's a card here
  sq.firewall // Team if there's a firewall here
}
```

#### Winner

Example:
```javascript
game.state.winner // undefined or Team
```

#### Grid

The grid is the main playing area consisting of 8 rows and 8 columns. These are indexed from 0 to 7 from top to bottom and left to right. That is, lower-indexed rows are closer to the team labeled "top".

```javascript
let grid = game.state.board.grid
grid.rows // array of rows, each row is an array of squares
grid.columns // array of columns, each column is an array of squares
grid.squares // all squares
grid.lookup(new Location(6, 3)) // Square
grid.columns[6][3] // Square
grid.rows[3][6] // Square
```

### Making a move

Players take turns to submit moves to the game via `game.submitMove`. An `InvalidMoveError` will be thrown if the move submitted is invalid.

**Move an online card**

```javascript
game.submitMove(new OnlineCardMove({
  team: Team.bottom,
  square: game.state.board.grid.lookup(new Location(4, 6)),
  direction: Direction.up
}))
```

**Move an online card with line boost / to the server area**

```javascript
game.submitMove(new OnlineCardMove({
  team: Team.bottom,
  square: game.state.board.grid.lookup(new Location(6, 0)),
  direction: Direction.left,
  direction2: Direction.up,
  revealCard: true
}))
game.state.board.stackArea.get(Team.top)[0].cause // 'infiltrated'
game.state.board.stackArea.get(Team.top)[0].card.revealed // true
```

**Install / uninstall a line boost / firewall card**

```javascript
game.submitMove(new InstallableTerminalCardMove({
  team: Team.bottom,
  square: game.state.board.grid.lookup(new Location(4, 6)),
  cardType: TerminalCardType.lineBoost,
  uninstall: false
}))
```

**Use a virus check card**

```javascript
game.submitMove(new TerminalCardMove({
  team: Team.top,
  square: game.state.board.grid.lookup(new Location(5, 6)),
  cardType: TerminalCardType.virusCheck
}))
game.state.board.grid.columns[5][6].card.revealed // true
```

**Use a 404 Not Found card**

```javascript
game.submitMove(new NotFoundTerminalCardMove({
  team: Team.bottom,
  square: game.state.board.grid.lookup(new Location(4, 6)),
  other: game.state.board.grid.lookup(new Location(5, 6)),
  swap: true
}))
game.state.board.grid.columns[4][6].card.revealed // false
game.state.board.grid.columns[5][6].card.revealed // false
```

**Surrender**

```javascript
game.submitMove(new SurrenderMove({ team: Team.bottom }))
```

### Wrap-up

This is pretty much what's needed to interact with the module. Feel free to consult the full documentation / source code.

## Docs

Simply run `npm run jsdoc` to generate documentation.

## License

MIT
