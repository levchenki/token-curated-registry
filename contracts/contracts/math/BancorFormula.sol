// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./Power.sol";

/**
* @title Bancor formula by Bancor
*
* Licensed to the Apache Software Foundation (ASF) under one or more contributor license agreements;
* and to You under the Apache License, Version 2.0. "
*/
contract BancorFormula is Power {
    uint32 private constant MAX_RESERVE_RATIO = 1000000;

    /**
    * @dev given a continuous token supply, reserve token balance, reserve ratio, and a deposit amount (in the reserve token),
    * calculates the return for a given conversion (in the continuous token)
    *
    * Formula:
    * Return = _supply * ((1 + _depositAmount / _reserveBalance) ^ (_reserveRatio / MAX_RESERVE_RATIO) - 1)
    *
    * @param _supply              continuous token total supply
    * @param _reserveBalance    total reserve token balance
    * @param _reserveRatio     reserve ratio, represented in ppm, 1-1000000
    * @param _depositAmount       deposit amount, in reserve token
    *
    *  @return purchase return amount
    */
    function calculatePurchaseReturn(
        uint _supply,
        uint _reserveBalance,
        uint32 _reserveRatio,
        uint _depositAmount) internal view returns (uint)
    {
        // validate input
        require(_supply > 0 && _reserveBalance > 0 && _reserveRatio > 0 && _reserveRatio <= MAX_RESERVE_RATIO, "Invalid inputs.");

        // special case for 0 deposit amount
        if (_depositAmount == 0) {
            return 0;
        }

        // special case if the ratio = 100%
        if (_reserveRatio == MAX_RESERVE_RATIO) {
            return (_supply * _depositAmount) / _reserveBalance;
        }

        uint result;
        uint8 precision;
        uint baseN = _depositAmount + _reserveBalance;
        (result, precision) = power(
            baseN, _reserveBalance, _reserveRatio, MAX_RESERVE_RATIO
        );
        uint newTokenSupply = (_supply * result) >> precision;
        return newTokenSupply - _supply;
    }

    /**
    * @dev given a continuous token supply, reserve token balance, reserve ratio and a sell amount (in the continuous token),
    * calculates the return for a given conversion (in the reserve token)
    *
    * Formula:
    * Return = _reserveBalance * (1 - (1 - _sellAmount / _supply) ^ (1 / (_reserveRatio / MAX_RESERVE_RATIO)))
    *
    * @param _supply              continuous token total supply
    * @param _reserveBalance    total reserve token balance
    * @param _reserveRatio     constant reserve ratio, represented in ppm, 1-1000000
    * @param _sellAmount          sell amount, in the continuous token itself
    *
    * @return sale return amount
    */
    function calculateSaleReturn(
        uint _supply,
        uint _reserveBalance,
        uint32 _reserveRatio,
        uint _sellAmount) internal view returns (uint)
    {
        // validate input
        require(_supply > 0 && _reserveBalance > 0 && _reserveRatio > 0 && _reserveRatio <= MAX_RESERVE_RATIO && _sellAmount <= _supply, "Invalid inputs.");

        // special case for 0 sell amount
        if (_sellAmount == 0) {
            return 0;
        }

        // special case for selling the entire supply
        if (_sellAmount == _supply) {
            return _reserveBalance;
        }

        // special case if the ratio = 100%
        if (_reserveRatio == MAX_RESERVE_RATIO) {
            return (_reserveBalance * _sellAmount) / _supply;
        }

        uint result;
        uint8 precision;
        uint baseD = _supply - _sellAmount;
        (result, precision) = power(
            _supply, baseD, MAX_RESERVE_RATIO, _reserveRatio
        );
        uint oldBalance = _reserveBalance * result;
        uint newBalance = _reserveBalance << precision;
        return (oldBalance - newBalance) / result;
    }
}