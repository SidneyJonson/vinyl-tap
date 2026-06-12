// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VinylTap {
    mapping(address => uint256) public userBeats;
    mapping(address => uint256) public userBasses;
    mapping(address => uint256) public userEchoes;

    uint256 public totalBeats;
    uint256 public totalBasses;
    uint256 public totalEchoes;

    event BeatTapped(address indexed user, uint256 userBeats, uint256 totalBeats);
    event BassTapped(address indexed user, uint256 userBasses, uint256 totalBasses);
    event EchoTapped(address indexed user, uint256 userEchoes, uint256 totalEchoes);

    function tapBeat() external {
        unchecked {
            userBeats[msg.sender] += 1;
            totalBeats += 1;
        }
        emit BeatTapped(msg.sender, userBeats[msg.sender], totalBeats);
    }

    function tapBass() external {
        unchecked {
            userBasses[msg.sender] += 1;
            totalBasses += 1;
        }
        emit BassTapped(msg.sender, userBasses[msg.sender], totalBasses);
    }

    function tapEcho() external {
        unchecked {
            userEchoes[msg.sender] += 1;
            totalEchoes += 1;
        }
        emit EchoTapped(msg.sender, userEchoes[msg.sender], totalEchoes);
    }
}
