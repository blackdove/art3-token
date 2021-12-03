import { task } from "hardhat/config";
import { Signer } from "@ethersproject/abstract-signer";
import Safe, { EthersAdapter } from '@gnosis.pm/safe-core-sdk';
import { JsonRpcProvider } from '@ethersproject/providers'

import { ART3 } from "../../src/types/ART3";
import { ART3__factory } from "../../src/types/factories/ART3__factory";
import { SafeService, SafeEthersSigner } from "@gnosis.pm/safe-ethers-adapters"

const safe_service: Map<String, String> = new Map<string, string>();
safe_service.set('rinkeby', 'https://safe-transaction.rinkeby.gnosis.io/');
safe_service.set('mainnet', 'https://safe-transaction.gnosis.io/');

const etherscan_uri: Map<String, String> = new Map<string, string>();
etherscan_uri.set('rinkeby', 'https://rinkeby.etherscan.io/');
etherscan_uri.set('mainnet', 'https://etherscan.io/');

task("deploy:ART3")
  .addOptionalParam('safe', 'The address of a safe')
  .addOptionalParam('targetnetwork', 'The network to deploy to', 'mainnet')
  .setAction(async function ({ safe, targetnetwork }, { ethers }) {
    const accounts: Signer[] = await ethers.getSigners();
    let signer: Signer = accounts[0];
    if (safe !== undefined) {
      const provider: JsonRpcProvider = new JsonRpcProvider(`https://${targetnetwork}.infura.io/v3/${process.env.INFURA_API_KEY}`);
      const serviceUrl = `${safe_service.get(targetnetwork)!}`;
      const service = new SafeService(serviceUrl);
      const ethAdapter = new EthersAdapter({ ethers, signer })
      const s = await Safe.create({ ethAdapter, safeAddress: safe })
      signer = new SafeEthersSigner(s, service, provider);
    }
    const art3Factory: ART3__factory = <ART3__factory>await ethers.getContractFactory("ART3", signer);
    const art3: ART3 = <ART3>await art3Factory.deploy();
    await art3.deployed();
    console.log("ART3 deployed to: ", art3.address);
    const etherscanUrl = `${etherscan_uri.get(targetnetwork)!}`;
    console.log(`View it on etherscan: ${etherscanUrl}token/${art3.address}`);
  });
