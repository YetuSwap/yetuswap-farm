const { assert } = require("chai");

const YetubitToken = artifacts.require('YetubitToken');

contract('YetubitToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.yetu = await YetubitToken.new(minter, { from: minter });
    });


    it('mint to new owner', async () => {
        await this.yetu.transferOwnership(alice, { from: minter });
        await this.yetu.mint(1000, { from: alice });
        assert.equal((await this.yetu.balanceOf(alice)).toString(), '1000');
    })
});
