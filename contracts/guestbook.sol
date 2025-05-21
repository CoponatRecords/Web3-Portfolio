// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Guestbook {
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    Message[] public messages;

    event NewMessage(address indexed sender, string content, uint256 timestamp);

    function postMessage(string calldata _content) external {
        require(bytes(_content).length > 0, "Message cannot be empty");
        messages.push(Message(msg.sender, _content, block.timestamp));
        emit NewMessage(msg.sender, _content, block.timestamp);
    }

    function getAllMessages() external view returns (Message[] memory) {
        return messages;
    }
}