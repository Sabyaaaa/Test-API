// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;
contract EscrowDemo {
    struct Person {
        string name;
        uint256 age;
    }

    Person[] public people;

    event PersonAdded(string name, uint256 age);

    function add(string memory _name, uint256 _age) public {
        Person memory newPerson = Person(_name, _age);
        people.push(newPerson);

        emit PersonAdded(_name, _age);
    }

    function get(uint256 _index) public view returns (string memory, uint256) {
        require(_index < people.length, "Index out of range");

        Person storage person = people[_index];
        return (person.name, person.age);
    }
}