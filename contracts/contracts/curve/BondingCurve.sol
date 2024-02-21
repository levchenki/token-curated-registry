// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;


import "../math/BancorFormula.sol";
import "../interfaces/IBondingCurve.sol";

abstract contract BondingCurve is BancorFormula, IBondingCurve {
    uint32 public reserveRatio;

    constructor(uint32 _reserveRatio) {
        reserveRatio = _reserveRatio;
    }

    function getContinuousMintReward(uint _reserveTokenAmount) public view returns (uint) {
        return calculatePurchaseReturn(continuousSupply(), reserveBalance(), reserveRatio, _reserveTokenAmount);
    }

    function getContinuousBurnRefund(uint _continuousTokenAmount) public view returns (uint) {
        return calculateSaleReturn(continuousSupply(), reserveBalance(), reserveRatio, _continuousTokenAmount);
    }

    /**
    * @dev Abstract method that returns continuous token supply
    */
    function continuousSupply() public virtual view returns (uint);

    /**
    * @dev Abstract method that returns reserve token balance
    */
    function reserveBalance() public virtual view returns (uint);
}
