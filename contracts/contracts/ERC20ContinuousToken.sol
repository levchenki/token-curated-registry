// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./ContinuousToken.sol";

contract ERC20ContinuousToken is ContinuousToken {
    ERC20 public reserveToken;

    constructor(
        string memory _name,
        string memory _symbol,
        uint _initialSupply,
        uint32 _reserveRatio,
        address _initialOwner,
        ERC20 _reserveToken
    ) ContinuousToken(_name, _symbol, _initialSupply, _reserveRatio, _initialOwner) {
        reserveToken = _reserveToken;
    }

    function mint(uint _amount) public payable {
        _continuousMint(_amount);
        require(reserveToken.transferFrom(msg.sender, address(this), _amount), "mint() ERC20.transferFrom failed.");
    }

    function burn(uint _amount) public {
        uint returnAmount = _continuousBurn(_amount);
        require(reserveToken.transfer(msg.sender, returnAmount), "burn() ERC20.transfer failed.");
    }

    function getReserveBalance() public override view returns (uint) {
        return reserveToken.balanceOf(address(this));
    }
}