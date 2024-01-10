// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TLToken is ERC20 {
    constructor() ERC20("Turk Lirasi Token", "TLT") {
        _mint(msg.sender, 1000000 * 10 ** 18); // Initial supply: 1,000,000 TLT
    }
}

contract Transactions {
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint256 amount, string message, uint256 timestamp, string keyword);

    struct TransferStruct {
        address sender;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain(address receiver, uint256 amount, string memory message, string memory keyword, address tokenAddress) public {
        require(amount > 0, "Amount must be greater than 0");

        // Check if the token at the given address is an ERC-20 token
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, receiver, amount);

        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
