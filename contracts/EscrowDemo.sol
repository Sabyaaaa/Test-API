// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;
contract EscrowDemo {
    struct Person {
        uint256 id;
        string name;
        uint256 age;
    }

    Person[] public people;

    event PersonAdded(uint256 id, string name, uint256 age);

    function add(uint256 _id, string memory _name, uint256 _age) public {
        Person memory newPerson = Person(_id, _name, _age);
        people.push(newPerson);

        emit PersonAdded(_id, _name, _age);
    }

    function get(uint256 _id) public view returns (Person memory) {
        return people[_id];
    }
}