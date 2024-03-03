// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./abstract/ABCContinuousToken.sol";

/**
* @title ETHABCContinuousToken
* @dev ETHABCContinuousToken is a ABCContinuousToken with ether as the reserve currency.
*/
contract ETHABCContinuousToken is ABCContinuousToken {

    constructor(
        string memory _name,
        string memory _symbol,
        uint _initialSupply,
        uint32 _reserveRatio,
        address _initialOwner,
        uint _accumulationDuration
    ) ABCContinuousToken(_name, _symbol, _initialSupply, 0, _reserveRatio, _initialOwner, _accumulationDuration) {
    }

    /**
    * @dev Fallback function to allow contract to receive ether.
    */
    receive() external payable onlyActivePeriod {
        mint();
    }

    /**
    * @dev Mints new tokens in exchange for ether.
    */
    function mint() public payable onlyActivePeriod {
        uint purchaseAmount = msg.value;
        _continuousMint(purchaseAmount);
    }

    /**
    * @param _amount Amount of tokens to burn.
    * @dev Burns tokens in exchange for a refund of ether.
    */
    function burn(uint _amount) public onlyActivePeriod {
        uint refundAmount = _continuousBurn(_amount);
        payable(msg.sender).transfer(refundAmount);
    }

    /**
    * @dev Deposits ether into the reserve.
    */
    function deposit() public payable onlyAccumulationPeriod {
        _deposit(msg.value);
    }
}