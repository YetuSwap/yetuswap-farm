const { expectRevert, time } = require('@openzeppelin/test-helpers');
const ethers = require('ethers');
const YetubitToken = artifacts.require('YetubitToken');
const MansaMusa = artifacts.require('MansaMusa');
const MockBEP20 = artifacts.require('libs/MockBEP20');
const Timelock = artifacts.require('Timelock');
const AfrikanBar = artifacts.require('AfrikanBar');

function encodeParameters(types, values) {
    const abi = new ethers.utils.AbiCoder();
    return abi.encode(types, values);
}

contract('Timelock', ([alice, bob, carol, dev, minter]) => {
    beforeEach(async () => {
        this.yetu = await YetubitToken.new({ from: alice });
        this.timelock = await Timelock.new(bob, '28800', { from: alice }); //8hours
    });

    it('should not allow non-owner to do operation', async () => {
        await this.yetu.transferOwnership(this.timelock.address, { from: alice });
        await expectRevert(
            this.yetu.transferOwnership(carol, { from: alice }),
            'Ownable: caller is not the owner',
        );
        await expectRevert(
            this.yetu.transferOwnership(carol, { from: bob }),
            'Ownable: caller is not the owner',
        );
        await expectRevert(
            this.timelock.queueTransaction(
                this.yetu.address, '0', 'transferOwnership(address)',
                encodeParameters(['address'], [carol]),
                (await time.latest()).add(time.duration.hours(6)),
                { from: alice },
            ),
            'Timelock::queueTransaction: Call must come from admin.',
        );
    });

    it('should do the timelock thing', async () => {
        await this.yetu.transferOwnership(this.timelock.address, { from: alice });
        const eta = (await time.latest()).add(time.duration.hours(9));
        await this.timelock.queueTransaction(
            this.yetu.address, '0', 'transferOwnership(address)',
            encodeParameters(['address'], [carol]), eta, { from: bob },
        );
        await time.increase(time.duration.hours(1));
        await expectRevert(
            this.timelock.executeTransaction(
                this.yetu.address, '0', 'transferOwnership(address)',
                encodeParameters(['address'], [carol]), eta, { from: bob },
            ),
            "Timelock::executeTransaction: Transaction hasn't surpassed time lock.",
        );
        await time.increase(time.duration.hours(8));
        await this.timelock.executeTransaction(
            this.yetu.address, '0', 'transferOwnership(address)',
            encodeParameters(['address'], [carol]), eta, { from: bob },
        );
        assert.equal((await this.yetu.owner()).valueOf(), carol);
    });

    it('should also work with MansaMusa', async () => {
        this.lp1 = await MockBEP20.new('LPToken', 'LP', '10000000000', { from: minter });
        this.lp2 = await MockBEP20.new('LPToken', 'LP', '10000000000', { from: minter });
        this.afrikan = await AfrikanBar.new(this.yetu.address, { from: minter });
        this.musa = await MansaMusa.new(this.yetu.address, this.afrikan.address, dev, '1000', '0', { from: alice });
        await this.yetu.transferOwnership(this.musa.address, { from: alice });
        await this.afrikan.transferOwnership(this.musa.address, { from: minter });
        await this.musa.add('100', this.lp1.address, true, { from: alice });
        await this.musa.transferOwnership(this.timelock.address, { from: alice });
        await expectRevert(
            this.musa.add('100', this.lp1.address, true, { from: alice }),
            "revert Ownable: caller is not the owner",
        );

        const eta = (await time.latest()).add(time.duration.hours(9));
        await this.timelock.queueTransaction(
            this.musa.address, '0', 'transferOwnership(address)',
            encodeParameters(['address'], [minter]), eta, { from: bob },
        );
        // await this.timelock.queueTransaction(
        //     this.musa.address, '0', 'add(uint256,address,bool)',
        //     encodeParameters(['uint256', 'address', 'bool'], ['100', this.lp2.address, false]), eta, { from: bob },
        // );
        await time.increase(time.duration.hours(9));
        await this.timelock.executeTransaction(
            this.musa.address, '0', 'transferOwnership(address)',
            encodeParameters(['address'], [minter]), eta, { from: bob },
        );
        await expectRevert(
            this.musa.add('100', this.lp1.address, true, { from: alice }),
            "revert Ownable: caller is not the owner",
        );
        await this.musa.add('100', this.lp1.address, true, { from: minter })
        // await this.timelock.executeTransaction(
        //     this.musa.address, '0', 'add(uint256,address,bool)',
        //     encodeParameters(['uint256', 'address', 'bool'], ['100', this.lp2.address, false]), eta, { from: bob },
        // );
        // assert.equal((await this.musa.poolInfo('0')).valueOf().allocPoint, '200');
        // assert.equal((await this.musa.totalAllocPoint()).valueOf(), '300');
        // assert.equal((await this.musa.poolLength()).valueOf(), '2');
    });
});
