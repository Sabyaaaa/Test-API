// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./EscrowDemo.sol";

contract Factory {
    event ContractCreated(address newContract, uint256 timestamp);

    EscrowDemo[] public deployedContracts;

    function createContract() public {
        EscrowDemo newContract = new EscrowDemo();
        deployedContracts.push(newContract);
        emit ContractCreated(address(newContract), block.timestamp);
    }

    function getDeployedContracts() public view returns (EscrowDemo[] memory) {
        return deployedContracts;
    }
}