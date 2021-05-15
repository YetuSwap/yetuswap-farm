//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import './MansaMusa.sol';

contract LotteryRewardPool is Ownable {
    using SafeBEP20 for IBEP20;

    MansaMusa public musa;
    address public adminAddress;
    address public receiver;
    IBEP20 public lptoken;
    IBEP20 public yetu;

    constructor(
        MansaMusa _musa,
        IBEP20 _yetu,
        address _admin,
        address _receiver
    ) public {
        musa = _musa;
        yetu = _yetu;
        adminAddress = _admin;
        receiver = _receiver;
    }

    event StartFarming(address indexed user, uint256 indexed pid);
    event Harvest(address indexed user, uint256 indexed pid);
    event EmergencyWithdraw(address indexed user, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "admin: wut?");
        _;
    }

    function startFarming(uint256 _pid, IBEP20 _lptoken, uint256 _amount) external onlyAdmin {
        _lptoken.safeApprove(address(musa), _amount);
        musa.deposit(_pid, _amount);
        emit StartFarming(msg.sender, _pid);
    }

    function  harvest(uint256 _pid) external onlyAdmin {
        musa.deposit(_pid, 0);
        uint256 balance = yetu.balanceOf(address(this));
        yetu.safeTransfer(receiver, balance);
        emit Harvest(msg.sender, _pid);
    }

    function setReceiver(address _receiver) external onlyAdmin {
        receiver = _receiver;
    }

    function  pendingReward(uint256 _pid) external view returns (uint256) {
        return musa.pendingYetu(_pid, address(this));
    }

    // EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _amount) external onlyOwner {
        yetu.safeTransfer(address(msg.sender), _amount);
        emit EmergencyWithdraw(msg.sender, _amount);
    }

    function setAdmin(address _admin) external onlyOwner {
        adminAddress = _admin;
    }

}
