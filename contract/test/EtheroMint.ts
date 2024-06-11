import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("EtheroMint Token Minting", async function () {
  const totalSupply = BigInt(1000000n * 10n ** 18n).toString();
  const transferAmount = BigInt(100n * 10n ** 18n).toString();

  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const deployedContract = await ethers.deployContract("EtheroMint", [
      totalSupply,
    ]);
    return { deployedContract, owner, addr1, addr2 };
  }

  it("Should assign the total supply of tokens to the owner", async function () {
    const { deployedContract, owner } = await loadFixture(deployTokenFixture);
    const ownerBalance = await deployedContract.balanceOf(owner.address);
    expect(await deployedContract.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    const { deployedContract, owner, addr1, addr2 } = await loadFixture(
      deployTokenFixture
    );

    await deployedContract.transfer(addr1.address, transferAmount);
    expect(await deployedContract.balanceOf(addr1.address)).to.equal(
      transferAmount
    );

    await deployedContract
      .connect(addr1)
      .transfer(addr2.address, transferAmount);
    expect(await deployedContract.balanceOf(addr2.address)).to.equal(
      transferAmount
    );
  });
});
