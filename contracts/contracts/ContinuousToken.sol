// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./curve/BondingCurve.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
* @title ContinuousToken
* @dev ContinuousToken is an ERC20 token with a bonding curve.
*/
abstract contract ContinuousToken is Ownable, ERC20, BondingCurve {
    uint8 internal constant DECIMALS = 18;

    event Minted(address sender, uint amount, uint deposit);
    event Burned(address sender, uint amount, uint refund);

    /**
    * @param _name Name of the continuous token.
    * @param _symbol Symbol of the continuous token.
    * @param _initialSupply Initial supply of the continuous token.
    * @param _reserveRatio The reserve ratio of the bonding curve.
    * @param _initialOwner The address to receive all continuous tokens on contract creation.
    * @dev Initializes the bonding curve and sets the initial supply of the token.
    */
    constructor(
        string memory _name,
        string memory _symbol,
        uint _initialSupply,
        uint32 _reserveRatio,
        address _initialOwner
    ) ERC20(_name, _symbol) BondingCurve(_reserveRatio) Ownable(_initialOwner) {
        _mint(msg.sender, _initialSupply);
    }

    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }

    /**
    * @dev Returns the total supply of tokens.
    */
    function getContinuousSupply() public override view returns (uint) {
        return totalSupply();
    }

    /**
    * @param _deposit Amount of tokens to deposit.
    * @dev Mints new tokens in exchange for deposit.
    */
    function _continuousMint(uint _deposit) internal returns (uint) {
        require(_deposit > 0, "Deposit must be non-zero.");

        uint rewardAmount = getContinuousMintReward(_deposit);
        _mint(msg.sender, rewardAmount);
        emit Minted(msg.sender, rewardAmount, _deposit);
        return rewardAmount;
    }

    /**
    * @param _amount Amount of tokens to burn.
    * @dev Burns tokens in exchange for a refund of reserve tokens.
    */
    function _continuousBurn(uint _amount) internal returns (uint) {
        require(_amount > 0, "Amount must be non-zero.");
        require(balanceOf(msg.sender) >= _amount, "Insufficient tokens to burn.");

        uint refundAmount = getContinuousBurnRefund(_amount);
        _burn(msg.sender, _amount);
        emit Burned(msg.sender, _amount, refundAmount);
        return refundAmount;
    }
}