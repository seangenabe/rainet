
var chai = require('chai')
var expect = chai.expect
var RaiNet = require('../rainet')
var InstallableTerminalCardMove = require('../installable-terminal-card-move')
var getEnemyTeam = require('../get-enemy-team')
var util = require('util')

describe('RaiNet', function() {

  describe('module loading', function() {

    it('should load with proper case', function() {

      expect(RaiNet)
      .to.have.property('InstallableTerminalCardMove')
      .that.is.equal(InstallableTerminalCardMove)

      expect(RaiNet)
      .itself.to.respondTo('getEnemyTeam')
      expect(RaiNet.getEnemyTeam).to.be.equal(getEnemyTeam)

    })

  })

})
