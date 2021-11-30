import { task } from "hardhat/config";
import { Signer } from "@ethersproject/abstract-signer";

import { ART3 } from "../../src/types/ART3";
import { ART3__factory } from "../../src/types/factories/ART3__factory";

task("deploy:ART3")
  .addOptionalParam('safe', 'The address of a safe')
  .setAction(async function ({ safe }, { ethers }) {
    const accounts: Signer[] = await ethers.getSigners();
    let signer;
    if (safe !== undefined) {
      const service = new SafeService("https://safe-transaction.gnosis.io/")
      signer = await SafeEthersSigner.create("some_safe_address", accounts[], service)
    } else {
      signer = accounts[0];
    }
    const art3Factory: ART3__factory = <ART3__factory>await ethers.getContractFactory("ART3", signer);
    const art3: ART3 = <ART3>await art3Factory.deploy();
    await art3.deployed();
    console.log("ART3 deployed to: ", art3.address);
    console.log(`View it on etherscan: https://rinkeby.etherscan.io/token/${art3.address}`);
  });
