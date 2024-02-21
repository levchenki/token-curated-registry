// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./ContinuousToken.sol";

contract ETHContinuousToken is ContinuousToken {
    uint256 internal reserve;

    constructor(
        string memory _name,
        string memory _symbol,
        uint _initialSupply,
        uint32 _reserveRatio,
        address _initialOwner
    ) payable ContinuousToken(_name, _symbol, _initialSupply, _reserveRatio, _initialOwner) {
        reserve = msg.value;
    }

    receive() external payable {
        mint();
    }

    function mint() public payable {
        uint purchaseAmount = msg.value;
        _continuousMint(purchaseAmount);
        reserve = reserve + purchaseAmount;
    }

    function burn(uint _amount) public {
        uint refundAmount = _continuousBurn(_amount);
        reserve = reserve - refundAmount;
        payable(msg.sender).transfer(refundAmount); // Приведение msg.sender к типу payable
    }

    function reserveBalance() public override view returns (uint) {
        return reserve;
    }
}