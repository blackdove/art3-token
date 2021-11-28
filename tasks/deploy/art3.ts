import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { ART3 } from "../../src/types/ART3";
import { ART3__factory } from "../../src/types/factories/ART3__factory";

task("deploy:ART3")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const art3Factory: ART3__factory = <ART3__factory>await ethers.getContractFactory("ART3");
    const art3: ART3 = <ART3>await art3Factory.deploy();
    await art3.deployed();
    console.log("ART3 deployed to: ", art3.address);
    console.log(`View it on etherscan: https://rinkeby.etherscan.io/token/${art3.address}`);
  });
