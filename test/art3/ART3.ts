import { expect } from "chai";
import { artifacts, ethers, waffle } from "hardhat";
import type { Artifact } from "hardhat/types";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import type { ART3 } from "../../src/types/ART3";
import { Signers } from "../types";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await ethers.getSigners();
    this.signers.admin = signers[0];
    this.otherUser = signers[1];
    this.thirdUser = signers[2];
  });

  describe("ART3", function () {
    beforeEach(async function () {
      const art3Artifact: Artifact = await artifacts.readArtifact("ART3");
      this.art3 = <ART3>await waffle.deployContract(this.signers.admin, art3Artifact);
    });

    describe("transfer", function() {
      describe("when transfers are disabled", function() {
        it("should transfer from the owner", async function () {
          await this.art3.connect(this.signers.admin).transfer(this.otherUser.address, 10);
          expect(await this.art3.connect(this.signers.admin).balanceOf(this.otherUser.address)).to.equal(10);
        });
        it("should fail non-owner transactions", async function () {
          await this.art3.connect(this.signers.admin).transfer(this.otherUser.address, 10);
          expect(await this.art3.connect(this.otherUser).balanceOf(this.otherUser.address)).to.equal(10);
          try {
            await this.art3.connect(this.otherUser).transfer(this.signers.admin.address, 10)
            throw new Error("Boom");
          } catch (e: any) {
            expect(e.toString()).to.contain("Transfers aren't enabled");
          }
        });
      });
      describe("when transfers are enabled", function() {
        beforeEach(async function () {
          await this.art3.connect(this.signers.admin).enableTransfers(true);
        });
        it("should transfer from the owner", async function () {
          await this.art3.connect(this.signers.admin).transfer(this.otherUser.address, 10);
          expect(await this.art3.connect(this.signers.admin).balanceOf(this.otherUser.address)).to.equal(10);
        });
        it("should transfer from other addresses", async function () {
          await this.art3.connect(this.signers.admin).transfer(this.otherUser.address, 10);
          expect(await this.art3.connect(this.otherUser).balanceOf(this.otherUser.address)).to.equal(10);
          await this.art3.connect(this.otherUser).transfer(this.signers.admin.address, 10);
          expect(await this.art3.connect(this.otherUser).balanceOf(this.otherUser.address)).to.equal(0);
        });
      });
    });

    describe("transferFrom", function() {
      describe("when transfers are disabled", function() {
        it("should transferFrom from the owner", async function () {
          await this.art3.connect(this.signers.admin).approve(this.signers.admin.address, 10);
          await this.art3.connect(this.signers.admin).transferFrom(this.signers.admin.address, this.otherUser.address, 10);
          expect(await this.art3.connect(this.signers.admin).balanceOf(this.otherUser.address)).to.equal(10);
        });
        it("should not transferFrom from other users", async function () {
          await this.art3.connect(this.signers.admin).transfer(this.otherUser.address, 10);
          expect(await this.art3.connect(this.otherUser).balanceOf(this.otherUser.address)).to.equal(10);
          try {
            await this.art3.connect(this.otherUser).approve(this.signers.admin.address, 10);
          } catch (e: any) {
            expect(e.toString()).to.contain("Transfers aren't enabled");
          }
        });
      });
      describe("when transfers are enabled", function() {
        beforeEach(async function () {
          await this.art3.connect(this.signers.admin).enableTransfers(true);

          // Give the little guy some cash
          await this.art3.connect(this.signers.admin).approve(this.signers.admin.address, 10);
          await this.art3.connect(this.signers.admin).transferFrom(this.signers.admin.address, this.otherUser.address, 10);
        });
        it("should transferFrom from all users", async function () {
          await this.art3.connect(this.otherUser).approve(this.thirdUser.address, 5);
          await this.art3.connect(this.thirdUser).transferFrom(this.otherUser.address, this.thirdUser.address, 5)
        });
      });
    });
  });
});
