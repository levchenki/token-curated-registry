// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./ContinuousToken.sol";

/**
* @title ETHContinuousToken
* @dev ETHContinuousToken is a ContinuousToken with ether as the reserve currency.
*/
contract ETHContinuousToken is ContinuousToken {

    /**
    * @param _name Name of the token.
    * @param _symbol Symbol of the token.
    * @param _initialSupply Initial supply of the token.
    * @param _reserveRatio The reserve ratio of the bonding curve.
    * @param _initialOwner The address to receive all tokens on contract creation.
    * @dev Sets the initial reserve balance and creates the token with the initial supply.
    */
    constructor(
        string memory _name,
        string memory _symbol,
        uint _initialSupply,
        uint32 _reserveRatio,
        address _initialOwner
    ) payable ContinuousToken(_name, _symbol, _initialSupply, _reserveRatio, _initialOwner, msg.value) {

    }

    /**
    * @dev Fallback function to allow contract to receive ether.
    */
    receive() external payable {
        mint();
    }

    /**
    * @dev Mints new tokens in exchange for ether.
    */
    function mint() public payable {
        uint purchaseAmount = msg.value;
        _continuousMint(purchaseAmount);
    }

    /**
    * @param _amount Amount of tokens to burn.
    * @dev Burns tokens in exchange for a refund of ether.
    */
    function burn(uint _amount) public {
        uint refundAmount = _continuousBurn(_amount);
        payable(msg.sender).transfer(refundAmount);
    }
}