const { advanceBlockTo } = require('@openzeppelin/test-helpers/src/time');
const { assert } = require('chai');
const YetubitToken = artifacts.require('YetubitToken');
const AfrikanBar = artifacts.require('AfrikanBar');

contract('AfrikanBar', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.yetu = await YetubitToken.new(minter, { from: minter });
    this.afrikan = await AfrikanBar.new(this.yetu.address, { from: minter });
  });

  it('mint', async () => {
    await this.afrikan.mint(alice, 1000, { from: minter });
    assert.equal((await this.afrikan.balanceOf(alice)).toString(), '1000');
  });

  it('burn', async () => {
    await advanceBlockTo('650');
    await this.afrikan.mint(alice, 1000, { from: minter });
    await this.afrikan.mint(bob, 1000, { from: minter });
    assert.equal((await this.afrikan.totalSupply()).toString(), '2000');
    await this.afrikan.burn(alice, 200, { from: minter });

    assert.equal((await this.afrikan.balanceOf(alice)).toString(), '800');
    assert.equal((await this.afrikan.totalSupply()).toString(), '1800');
  });

  it('safeYetuTransfer', async () => {
    assert.equal(
      (await this.yetu.balanceOf(this.afrikan.address)).toString(),
      '0'
    );
    await this.yetu.transfer(this.afrikan.address, 1000, { from: minter });
    await this.afrikan.safeYetuTransfer(bob, 200, { from: minter });
    assert.equal((await this.yetu.balanceOf(bob)).toString(), '200');
    assert.equal(
      (await this.yetu.balanceOf(this.afrikan.address)).toString(),
      '800'
    );
    await this.afrikan.safeYetuTransfer(bob, 2000, { from: minter });
    assert.equal((await this.yetu.balanceOf(bob)).toString(), '1000');
  });
});
