// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ReserveERC20Token is ERC20 {

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
    }

    function mint(uint _amount) public {
        _mint(msg.sender, _amount);
    }
}