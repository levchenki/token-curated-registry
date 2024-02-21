// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./curve/BondingCurve.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ContinuousToken is Ownable, ERC20, BondingCurve {

    event Minted(address sender, uint amount, uint deposit);
    event Burned(address sender, uint amount, uint refund);

    // decimals = 18
    constructor(
        string memory _name,
        string memory _symbol,
        uint _initialSupply,
        uint32 _reserveRatio,
        address _initialOwner
    ) ERC20(_name, _symbol) BondingCurve(_reserveRatio) Ownable(_initialOwner) {
        _mint(msg.sender, _initialSupply);
    }

    function continuousSupply() public override view returns (uint) {
        return totalSupply(); // Continuous Token total supply
    }

    function _continuousMint(uint _deposit) internal returns (uint) {
        require(_deposit > 0, "Deposit must be non-zero.");

        uint rewardAmount = getContinuousMintReward(_deposit);
        _mint(msg.sender, rewardAmount);
        emit Minted(msg.sender, rewardAmount, _deposit);
        return rewardAmount;
    }

    function _continuousBurn(uint _amount) internal returns (uint) {
        require(_amount > 0, "Amount must be non-zero.");
        require(balanceOf(msg.sender) >= _amount, "Insufficient tokens to burn.");

        uint refundAmount = getContinuousBurnRefund(_amount);
        _burn(msg.sender, _amount);
        emit Burned(msg.sender, _amount, refundAmount);
        return refundAmount;
    }

    function sponsoredBurn(uint _amount) public {
        _burn(msg.sender, _amount);
        emit Burned(msg.sender, _amount, 0);
    }

}