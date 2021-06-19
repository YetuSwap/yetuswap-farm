# YetuSwap

https://yetuswap.finance. Feel free to read the code. More details coming soon.

## Deployed Contracts / Hash

### BSCMAINNET

- YetubitToken - https://bscscan.com/token/0x6652048fa5e66ed63a0225ffd7c82e106b0aa18b
- MansaMusa - https://bscscan.com/address/0x73feaa1eE314F8c655E354234017bE2193C9E24E
- (Uni|Yetu)swapV2Factory - https://bscscan.com/address/0xE3E3B5ECA67AF8Ce67C1017C4098c5Be91176CeA
- (Uni|Yetu)swapV2Router02 - https://bscscan.com/address/0x4837b50242f104ACd3FA23E00Bf7e9A5fC4D5844
- (Uni|Yetu)swapV2Pair init code hash - `0x630de1cb6e451aba82b8f7f0decfc41e16cf45fcf3518f11e4960918f1673d21`
- MultiCall - 0xE1dDc30f691CA671518090931e3bFC1184BFa4Aa

## TEST Results

```
Contract: AfrikanBar
    ✓ mint (45ms)
    ✓ burn (1663ms)
    ✓ safeYetuTransfer (83ms)

  Contract: BnbStaking.......
    ✓ deposit/withdraw (405ms)
    ✓ should block man who in blanklist (126ms)
    ✓ emergencyWithdraw (77ms)
    ✓ emergencyRewardWithdraw (48ms)
    ✓ setLimitAmount

  Contract: MansaMusa
    ✓ real case (264ms)
    ✓ setReceiver (211ms)
    ✓ emergencyWithdraw
    ✓ update admin (90ms)

  Contract: MansaMusa
    ✓ real case (891ms)
    ✓ deposit/withdraw (535ms)
    ✓ staking/unstaking (384ms)
    ✓ update multiplier (990ms)
    ✓ should allow dev and only dev to update dev (85ms)

  Contract: Timelock
    ✓ should not allow non-owner to do operation (96ms)
    ✓ should do the timelock thing (77ms)
    ✓ should also work with MansaMusa (317ms)

  Contract: YetubitToken
    ✓ mint to new owner


  21 passing (10s)
```
