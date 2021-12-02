import { task } from "hardhat/config";
import { Signer } from "@ethersproject/abstract-signer";
import Safe, { EthersAdapter } from '@gnosis.pm/safe-core-sdk';
import { JsonRpcProvider } from '@ethersproject/providers'

import { ART3 } from "../../src/types/ART3";
import { ART3__factory } from "../../src/types/factories/ART3__factory";
import { SafeService, SafeEthersSigner } from "@gnosis.pm/safe-ethers-adapters"

task("deploy:ART3")
  .addOptionalParam('safe', 'The address of a safe')
  .setAction(async function ({ safe }, { ethers }) {
    const accounts: Signer[] = await ethers.getSigners();
    let signer: Signer = accounts[0];
    if (safe !== undefined) {
      const provider = new JsonRpcProvider('https://rinkeby.infura.io/v3/1c96603e022b4d97a08b70a95afae845');
      const service = new SafeService("https://safe-transaction.rinkeby.gnosis.io/");
      const ethAdapter = new EthersAdapter({ ethers, signer })
      const s = await Safe.create({ ethAdapter, safeAddress: '0xFE68454B0d5845687685e3BD9AaCece8988617BC' })
      signer = new SafeEthersSigner(s, service, provider);
    }
    const art3Factory: ART3__factory = <ART3__factory>await ethers.getContractFactory("ART3", signer);
    const art3: ART3 = <ART3>await art3Factory.deploy();
    await art3.deployed();
    console.log("ART3 deployed to: ", art3.address);
    console.log(`View it on etherscan: https://rinkeby.etherscan.io/token/${art3.address}`);
  });
