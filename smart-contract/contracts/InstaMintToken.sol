// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title InstaToken
 * @notice INSTA Token Contract — Rewards System Coming Soon
 */
contract InstaToken is ERC20, Ownable {
    constructor() ERC20("Insta Token", "INSTA") {
        // Mint initial supply to deployer
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
