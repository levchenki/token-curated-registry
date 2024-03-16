// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "../abstract/ABCContinuousToken.sol";

/**
* @title ERC20ABCContinuousToken
* @dev ERC20ABCContinuousToken is a ABCContinuousToken with ERC20 token as the reserve currency.
*/
contract ERC20ABCContinuousToken is ABCContinuousToken {
    address public reserveTokenAddress;

    constructor(
        string memory _name,
        string memory _symbol,
        uint _initialSupply,
        uint32 _reserveRatio,
        address _initialOwner,
        uint _accumulationDuration,
        address _reserveTokenAddress
    ) ABCContinuousToken(_name, _symbol, _initialSupply, 0, _reserveRatio, _initialOwner, _accumulationDuration) {
        reserveTokenAddress = _reserveTokenAddress;
    }

    /**
    * @param _amount Amount of erc20 tokens to mint.
    * @dev Mints new tokens in exchange for erc20 tokens.
    */
    function mint(uint _amount) public onlyActivePeriod {
        _continuousMint(_amount);
        require(IERC20(reserveTokenAddress).transferFrom(msg.sender, address(this), _amount), "mint() ERC20.transferFrom failed");
    }

    /**
    * @param _amount Amount of tokens to burn.
    * @dev Burns tokens in exchange for a refund of ether.
    */
    function burn(uint _amount) public onlyActivePeriod {
        uint refundAmount = _continuousBurn(_amount);
        require(IERC20(reserveTokenAddress).transfer(msg.sender, refundAmount), "burn() ERC20.transfer failed");
    }

    /**
    * @dev Deposits erc20 tokens into the reserve.
    */
    function deposit(uint _amount) public onlyAccumulationPeriod {
        _deposit(_amount);

        require(IERC20(reserveTokenAddress).transferFrom(msg.sender, address(this), _amount), "deposit() ERC20.transferFrom failed");
    }
}