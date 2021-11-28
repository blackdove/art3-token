//       __        _______  ___________  _______  
//      /""\      /"      \("     _   ")/" __   ) 
//     /    \    |:        |)__/  \\__/(__/ _) ./ 
//    /' /\  \   |_____/   )   \\_ /       /  //  
//   //  __'  \   //      /    |.  |    __ \_ \\  
//  /   /  \\  \ |:  __   \    \:  |   (: \__) :\ 
// (___/    \___)|__|  \___)    \__|    \_______) 
                                               

// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "hardhat/console.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ART3 is ERC20 {
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor() public ERC20("ART3", "ART3") {
        _mint(msg.sender, 1000000000000);
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}