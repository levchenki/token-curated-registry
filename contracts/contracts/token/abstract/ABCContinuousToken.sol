// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../curve/BondingCurve.sol";

/**
* @title ABCContinuousToken
* @dev ABCContinuousToken is an ERC20 token with a augmented bonding curve
*/
abstract contract ABCContinuousToken is Ownable, ERC20, BondingCurve {
    uint256 public accumulationDuration;
    uint256 public accumulationDateEnd;
    bool public isActive = false;
    mapping(address => uint256) public deposits;
    address[] private depositors;
    uint8 internal constant DECIMALS = 18;
    uint256 public reserve;
    uint256 public initialSupply;

    event Minted(address sender, uint amount, uint deposit);
    event Burned(address sender, uint amount, uint refund);
    event Deposited(address sender, uint amount);
    event Distributed(address to, uint amount);

    /**
    * @param _name Name of the token.
    * @param _symbol Symbol of the token.
    * @param _initialSupply Initial supply of the token.
    * @param _reserve The initial balance of the reserve tokens.
    * @param _reserveRatio The reserve ratio of the augmented bonding curve.
    * @param _initialOwner The address to receive all tokens on contract creation.
    * @param _accumulationDuration The duration of the accumulation period.
    * @dev Sets the initial reserve balance and creates the token with the initial supply.
    */
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        uint256 _reserve,
        uint32 _reserveRatio,
        address _initialOwner,
        uint256 _accumulationDuration
    ) ERC20(_name, _symbol) BondingCurve(_reserveRatio) Ownable(_initialOwner) {
        reserve = _reserve;
        initialSupply = _initialSupply;
        accumulationDuration = _accumulationDuration;
        accumulationDateEnd = block.timestamp + _accumulationDuration;
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
    * @dev Returns the total reserve balance.
    */
    function getReserveBalance() public override view returns (uint) {
        return reserve;
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
    function _deposit(uint256 depositAmount) internal onlyAccumulationPeriod {
        require(depositAmount > 0, "Deposit must be greater than 0");
        if (deposits[msg.sender] == 0) {
            depositors.push(msg.sender);
        }
        deposits[msg.sender] += depositAmount;
        emit Deposited(msg.sender, depositAmount);
        reserve += depositAmount;
    }

    /**
    * @dev Function to distribute tokens to depositors before the active period.
    */
    function distribute() public onlyOwner onlyAccumulationPeriod {
        require(block.timestamp >= accumulationDateEnd, "Accumulation duration has not ended yet");
        require(reserve > 0, "Reserve must be greater than 0");
        uint256 distributed = 0;
        for (uint256 i = 0; i < depositors.length; i++) {
            uint256 tokens = _countDistributedTokens(i);
            distributed += tokens;
            emit Distributed(depositors[i], tokens);
            _mint(depositors[i], tokens);
        }
        if (distributed < initialSupply) {
            uint256 remaining = initialSupply - distributed;
            emit Distributed(owner(), remaining);
            _mint(owner(), remaining);
        }
        isActive = true;
    }

    /**
    * @dev Function to count the amount of tokens to be distributed to a depositor.
    * @param depositorIndex The index of the depositor in the depositors array.
    */
    function _countDistributedTokens(uint256 depositorIndex) internal view returns (uint256) {
        uint256 depositAmount = deposits[depositors[depositorIndex]];
        uint256 tokens = depositAmount * initialSupply / reserve;
        return tokens;
    }

    /**
    * @param _depositAmount Amount of tokens to mint.
    * @dev Mints new tokens in exchange for deposit.
    */
    function _continuousMint(uint256 _depositAmount) internal returns (uint) {
        require(_depositAmount > 0, "Deposit must be non-zero.");

        uint rewardAmount = getContinuousMintReward(_depositAmount);
        _mint(msg.sender, rewardAmount);
        emit Minted(msg.sender, rewardAmount, _depositAmount);
        reserve = reserve + _depositAmount;
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
        reserve = reserve - refundAmount;
        return refundAmount;
    }
}