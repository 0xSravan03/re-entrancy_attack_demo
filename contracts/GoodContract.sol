//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract GoodContract {
    mapping(address => uint256) public balances;

    function addBalance() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() public {
        require(balances[msg.sender] > 0, "Not enough ETH to withdraw");
        (bool sent, ) = payable(msg.sender).call{value: balances[msg.sender]}(
            ""
        );
        require(sent, "Transaction failed");

        // updating caller balance by 0
        balances[msg.sender] = 0;
    }
}
