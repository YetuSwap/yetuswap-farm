const { expectRevert, time } = require('@openzeppelin/test-helpers');
const YetubitToken = artifacts.require('YetubitToken');
const AfrikanBar = artifacts.require('AfrikanBar');
const MansaMusa = artifacts.require('MansaMusa');
const MockBEP20 = artifacts.require('libs/MockBEP20');

contract('MansaMusa', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.yetu = await YetubitToken.new(minter, { from: minter });
        this.afrikan = await AfrikanBar.new(this.yetu.address, { from: minter });
        this.lp1 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
        this.lp2 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
        this.lp3 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
        this.musa = await MansaMusa.new(this.yetu.address, this.afrikan.address, dev, '1000', '100', { from: minter });
        await this.yetu.transferOwnership(this.musa.address, { from: minter });
        await this.afrikan.transferOwnership(this.musa.address, { from: minter });

        await this.lp1.transfer(bob, '2000', { from: minter });
        await this.lp2.transfer(bob, '2000', { from: minter });
        await this.lp3.transfer(bob, '2000', { from: minter });

        await this.lp1.transfer(alice, '2000', { from: minter });
        await this.lp2.transfer(alice, '2000', { from: minter });
        await this.lp3.transfer(alice, '2000', { from: minter });
    });
    it('real case', async () => {
      this.lp4 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
      this.lp5 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
      this.lp6 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
      this.lp7 = await MockBEP20.new('LPToken', 'LP1', '1000000', { from: minter });
      this.lp8 = await MockBEP20.new('LPToken', 'LP2', '1000000', { from: minter });
      this.lp9 = await MockBEP20.new('LPToken', 'LP3', '1000000', { from: minter });
      await this.musa.add('2000', this.lp1.address, true, { from: minter });
      await this.musa.add('1000', this.lp2.address, true, { from: minter });
      await this.musa.add('500', this.lp3.address, true, { from: minter });
      await this.musa.add('500', this.lp3.address, true, { from: minter });
      await this.musa.add('500', this.lp3.address, true, { from: minter });
      await this.musa.add('500', this.lp3.address, true, { from: minter });
      await this.musa.add('500', this.lp3.address, true, { from: minter });
      await this.musa.add('100', this.lp3.address, true, { from: minter });
      await this.musa.add('100', this.lp3.address, true, { from: minter });
      assert.equal((await this.musa.poolLength()).toString(), "10");
     
      await time.advanceBlockTo('921');
      await this.lp1.approve(this.musa.address, '1000', { from: alice });
      assert.equal((await this.yetu.balanceOf(alice)).toString(), '0');
      await this.musa.deposit(1, '20', { from: alice });
      await this.musa.withdraw(1, '20', { from: alice });
      assert.equal((await this.yetu.balanceOf(alice)).toString(), '263');

      await this.yetu.approve(this.musa.address, '1000', { from: alice });
      await this.musa.enterStaking('20', { from: alice });
      await this.musa.enterStaking('0', { from: alice });
      await this.musa.enterStaking('0', { from: alice });
      await this.musa.enterStaking('0', { from: alice });
      assert.equal((await this.yetu.balanceOf(alice)).toString(), '993');
      // assert.equal((await this.musa.getPoolPoint(0, { from: minter })).toString(), '1900');
    })


    it('deposit/withdraw', async () => {
      await this.musa.add('1000', this.lp1.address, true, { from: minter });
      await this.musa.add('1000', this.lp2.address, true, { from: minter });
      await this.musa.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.musa.address, '100', { from: alice });
      await this.musa.deposit(1, '20', { from: alice });
      await this.musa.deposit(1, '0', { from: alice });
      await this.musa.deposit(1, '40', { from: alice });
      await this.musa.deposit(1, '0', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1940');
      await this.musa.withdraw(1, '10', { from: alice });
      assert.equal((await this.lp1.balanceOf(alice)).toString(), '1950');
      assert.equal((await this.yetu.balanceOf(alice)).toString(), '999');
      assert.equal((await this.yetu.balanceOf(dev)).toString(), '100');

      await this.lp1.approve(this.musa.address, '100', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
      await this.musa.deposit(1, '50', { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '1950');
      await this.musa.deposit(1, '0', { from: bob });
      assert.equal((await this.yetu.balanceOf(bob)).toString(), '125');
      await this.musa.emergencyWithdraw(1, { from: bob });
      assert.equal((await this.lp1.balanceOf(bob)).toString(), '2000');
    })

    it('staking/unstaking', async () => {
      await this.musa.add('1000', this.lp1.address, true, { from: minter });
      await this.musa.add('1000', this.lp2.address, true, { from: minter });
      await this.musa.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.musa.address, '10', { from: alice });
      await this.musa.deposit(1, '2', { from: alice }); //0
      await this.musa.withdraw(1, '2', { from: alice }); //1

      await this.yetu.approve(this.musa.address, '250', { from: alice });
      await this.musa.enterStaking('240', { from: alice }); //3
      assert.equal((await this.afrikan.balanceOf(alice)).toString(), '240');
      assert.equal((await this.yetu.balanceOf(alice)).toString(), '10');
      await this.musa.enterStaking('10', { from: alice }); //4
      assert.equal((await this.afrikan.balanceOf(alice)).toString(), '250');
      assert.equal((await this.yetu.balanceOf(alice)).toString(), '249');
      await this.musa.leaveStaking(250);
      assert.equal((await this.afrikan.balanceOf(alice)).toString(), '0');
      assert.equal((await this.yetu.balanceOf(alice)).toString(), '749');

    });


    it('update multiplier', async () => {
      await this.musa.add('1000', this.lp1.address, true, { from: minter });
      await this.musa.add('1000', this.lp2.address, true, { from: minter });
      await this.musa.add('1000', this.lp3.address, true, { from: minter });

      await this.lp1.approve(this.musa.address, '100', { from: alice });
      await this.lp1.approve(this.musa.address, '100', { from: bob });
      await this.musa.deposit(1, '100', { from: alice });
      await this.musa.deposit(1, '100', { from: bob });
      await this.musa.deposit(1, '0', { from: alice });
      await this.musa.deposit(1, '0', { from: bob });

      await this.yetu.approve(this.musa.address, '100', { from: alice });
      await this.yetu.approve(this.musa.address, '100', { from: bob });
      await this.musa.enterStaking('50', { from: alice });
      await this.musa.enterStaking('100', { from: bob });

      await this.musa.updateMultiplier('0', { from: minter });

      await this.musa.enterStaking('0', { from: alice });
      await this.musa.enterStaking('0', { from: bob });
      await this.musa.deposit(1, '0', { from: alice });
      await this.musa.deposit(1, '0', { from: bob });

      assert.equal((await this.yetu.balanceOf(alice)).toString(), '700');
      assert.equal((await this.yetu.balanceOf(bob)).toString(), '150');

      await time.advanceBlockTo('1016');

      await this.musa.enterStaking('0', { from: alice });
      await this.musa.enterStaking('0', { from: bob });
      await this.musa.deposit(1, '0', { from: alice });
      await this.musa.deposit(1, '0', { from: bob });

      assert.equal((await this.yetu.balanceOf(alice)).toString(), '700');
      assert.equal((await this.yetu.balanceOf(bob)).toString(), '150');

      await this.musa.leaveStaking('50', { from: alice });
      await this.musa.leaveStaking('100', { from: bob });
      await this.musa.withdraw(1, '100', { from: alice });
      await this.musa.withdraw(1, '100', { from: bob });

    });

    it('should allow dev and only dev to update dev', async () => {
        assert.equal((await this.musa.devaddr()).valueOf(), dev);
        await expectRevert(this.musa.dev(bob, { from: bob }), 'dev: wut?');
        await this.musa.dev(bob, { from: dev });
        assert.equal((await this.musa.devaddr()).valueOf(), bob);
        await this.musa.dev(alice, { from: bob });
        assert.equal((await this.musa.devaddr()).valueOf(), alice);
    })
});
