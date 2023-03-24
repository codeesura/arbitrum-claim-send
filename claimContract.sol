// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IWETH9 {
    function transfer(address recipient, uint256 amount) external returns (bool);
}
contract ContractYeni {

    function claim() public {
        require(IWETH9(address(0x82aF49447D8a07e3bd95BD0d56f35241523fBab1)).transfer(msg.sender, 20000000000000),"transfer hata");

    }
}
