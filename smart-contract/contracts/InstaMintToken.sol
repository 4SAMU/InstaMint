// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InstaToken is ERC20, Ownable {
    uint256 public constant MIN_CLAIM_XP = 100;

    // Track how much XP each user has already claimed for
    mapping(address => uint256) public claimedXp;

    constructor() ERC20("Insta Token", "INSTA") {
        _transferOwnership(msg.sender);
    }

    /**
     * @notice Claim INSTA tokens based on XP earned
     * @param user The address of the user claiming tokens
     * @param totalXp The total XP the user has earned (off-chain validated)
     */
    function claimReward(address user, uint256 totalXp) external onlyOwner {
        require(totalXp >= claimedXp[user] + MIN_CLAIM_XP, "Not enough XP to claim");

        uint256 unclaimedXp = totalXp - claimedXp[user];

        // Mint INSTA tokens equivalent to unclaimed XP
        _mint(user, unclaimedXp * 1e18); // 1 XP = 1 INSTA (18 decimals)

        // Update claimed XP
        claimedXp[user] = totalXp;
    }

    /**
     * @notice View function to check how many tokens a user can currently claim
     */
    function claimable(address user, uint256 totalXp) external view returns (uint256) {
        if (totalXp <= claimedXp[user]) return 0;
        uint256 unclaimedXp = totalXp - claimedXp[user];
        if (unclaimedXp < MIN_CLAIM_XP) return 0;
        return unclaimedXp * 1e18;
    }
}
