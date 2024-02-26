// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./ContinuousToken.sol";

/**
* @title AugmentedContinuousToken
* @dev AugmentedContinuousToken is a ContinuousToken with augmented bonding curve and ether as the reserve currency.
*/
contract AugmentedContinuousToken is ContinuousToken {
    uint256 public accumulationDuration;
    uint256 public accumulationDateEnd;
    bool public isActive = false;
    mapping(address => uint256) public deposits;
    address[] public depositors;

    /**
    * @param _name Name of the token.
    * @param _symbol Symbol of the token.
    * @param _initialSupply Initial supply of the token.
    * @param _reserveRatio The reserve ratio of the augmented bonding curve.
    * @param _initialOwner The address to receive all tokens on contract creation.
    * @param _accumulationDuration The duration of the accumulation period.
    * @dev Sets the initial reserve balance and creates the token with the initial supply.
    */
    constructor(
        string memory _name,
        string memory _symbol,
        uint _initialSupply,
        uint32 _reserveRatio,
        address _initialOwner,
        uint256 _accumulationDuration
    ) ContinuousToken(_name, _symbol, _initialSupply, _reserveRatio, _initialOwner, 0) {
        accumulationDuration = _accumulationDuration;
        accumulationDateEnd = block.timestamp + _accumulationDuration;
    }

    /**
    * @dev Modifier to check if the accumulation period has ended.
    */
    modifier onlyAccumulationPeriod() {
        require(!isActive, "Accumulation period has ended");
        _;
    }

    /**
    * @dev Modifier to check if the active period has started.
    */
    modifier onlyActivePeriod() {
        require(isActive, "The active period has not started yet");
        _;
    }

    /**
    * @dev Function to deposit ether into the reserve.
    */
    function deposit() public payable onlyAccumulationPeriod {
        require(msg.value > 0, "Deposit must be greater than 0");
        if (deposits[msg.sender] == 0) {
            depositors.push(msg.sender);
        }
        deposits[msg.sender] += msg.value;
        reserve += msg.value;
    }

    /**
    * @dev Function to distribute tokens to depositors before the active period.
    */
    function distribute() public onlyOwner onlyAccumulationPeriod {
        require(block.timestamp >= accumulationDateEnd, "Accumulation duration has not ended yet");
        require(reserve > 0, "Reserve must be greater than 0");
        for (uint256 i = 0; i < depositors.length; i++) {
            uint256 depositAmount = deposits[depositors[i]];
            uint256 tokens = depositAmount * reserve / totalSupply();
            transfer(depositors[i], tokens);
        }
        isActive = true;
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
}