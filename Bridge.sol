// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IWrappedToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
}

contract Bridge is Ownable {
    address public admin;
    IERC20 public token;
    bool public isDestination; // If true, we mint/burn. If false, we lock/unlock.

    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed user, uint256 amount, uint256 timestamp);

    constructor(address _token, bool _isDestination) Ownable(msg.sender) {
        token = IERC20(_token);
        isDestination = _isDestination;
        admin = msg.sender;
    }

    // Step 1: User locks tokens to cross over
    function lock(uint256 amount) external {
        require(amount > 0, "Amount 0");
        
        if (isDestination) {
            // If we are on destination, "locking" means burning the wrapped token to go back
            IWrappedToken(address(token)).burn(msg.sender, amount);
        } else {
            // If we are on source, we transfer tokens to the bridge vault
            token.transferFrom(msg.sender, address(this), amount);
        }

        emit Deposit(msg.sender, amount, block.timestamp);
    }

    // Step 2: Validator calls this to finalize the crossing
    function release(address to, uint256 amount) external onlyOwner {
        if (isDestination) {
            // Mint wrapped tokens
            IWrappedToken(address(token)).mint(to, amount);
        } else {
            // Unlock original tokens
            token.transfer(to, amount);
        }
        
        emit Withdrawn(to, amount, block.timestamp);
    }
}
