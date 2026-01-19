// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WrappedToken is ERC20, Ownable {
    address public bridge;

    constructor(string memory name, string memory symbol) 
        ERC20(name, symbol) 
        Ownable(msg.sender) 
    {}

    function setBridge(address _bridge) external onlyOwner {
        bridge = _bridge;
    }

    modifier onlyBridge() {
        require(msg.sender == bridge, "Not Bridge");
        _;
    }

    function mint(address to, uint256 amount) external onlyBridge {
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyBridge {
        _burn(from, amount);
    }
}
