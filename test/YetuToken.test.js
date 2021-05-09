const { assert } = require("chai");

const YetubitToken = artifacts.require('YetubitToken');

contract('YetubitToken', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.yetu = await YetubitToken.new({ from: minter });
    });


    it('mint', async () => {
        await this.yetu.mint(alice, 1000, { from: minter });
        assert.equal((await this.yetu.balanceOf(alice)).toString(), '1000');
    })
});
