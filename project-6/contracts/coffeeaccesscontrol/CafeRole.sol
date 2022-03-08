pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'CafeRole' to manage this role - add, remove, check
contract CafeRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event CafeAdded(address indexed account);
  event CafeRemoved(address indexed account);

  // Define a struct 'Cafes' by inheriting from 'Roles' library, struct Role
  Roles.Role private cafes;

  // In the constructor make the address that deploys this contract the 1st Cafe
  constructor() public {
    _addCafe(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyCafe() {
    require(isCafe(msg.sender));
    _;
  }

  // Define a function 'isCafe' to check this role
  function isCafe(address account) public view returns (bool) {
    return cafes.has(account);
  }

  // Define a function 'addCafe' that adds this role
  function addCafe(address account) public onlyCafe {
    _addCafe(account);
  }

  // Define a function 'renounceCafe' to renounce this role
  function renounceCafe() public {
    _removeCafe(msg.sender);
  }

  // Define an internal function '_addCafe' to add this role, called by 'addCafe'
  function _addCafe(address account) internal {
    cafes.add(account);
    emit CafeAdded(account);
  }

  // Define an internal function '_removeCafe' to remove this role, called by 'removeCafe'
  function _removeCafe(address account) internal {
    cafes.remove(account);
    emit CafeRemoved(account);
  }
}