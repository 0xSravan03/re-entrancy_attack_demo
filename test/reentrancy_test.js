const { ethers } = require("hardhat");
const { assert, expect } = require("chai");

describe("Attack", function () {
  let GoodContract, BadContract;

  beforeEach(async function () {
    // Deploying GoodContract
    const GoodContractFactory = await ethers.getContractFactory("GoodContract");
    GoodContract = await GoodContractFactory.deploy();
    await GoodContract.deployed();

    // Deploying BadContract
    const BadContractFactory = await ethers.getContractFactory("BadContract");
    BadContract = await BadContractFactory.deploy(GoodContract.address);
    await BadContract.deployed();
  });

  it("Should empty the balance of the good contract", async function () {
    // need two signer
    // innocent address
    // attacker address
    const [innocent, attacker] = await ethers.getSigners();

    // Funding GoodContract with 10 ETH
    let tx = await GoodContract.connect(innocent).addBalance({
      value: ethers.utils.parseEther("10"),
    });
    await tx.wait();

    const goodContractBalance = await ethers.provider.getBalance(
      GoodContract.address
    );

    console.log(goodContractBalance);
    // assert.equal(
    //   ethers.utils.formatEther(goodContractBalance).toString(),
    //   "10.0"
    // );
    expect(goodContractBalance).to.equal(ethers.utils.parseEther("10"));

    tx = await BadContract.connect(attacker).attack({
      value: ethers.utils.parseEther("1"),
    });
    await tx.wait();

    const goodContractBalance1 = await ethers.provider.getBalance(
      GoodContract.address
    );

    expect(goodContractBalance1).to.equal(ethers.BigNumber.from("0"));

    // Balance of the GoodContract's address is now zero
    let balanceETH = await ethers.provider.getBalance(GoodContract.address);
    expect(balanceETH).to.equal(ethers.BigNumber.from("0"));

    // Balance of BadContract is now 11 ETH (10 ETH stolen + 1 ETH from attacker)
    balanceETH = await ethers.provider.getBalance(BadContract.address);
    expect(balanceETH).to.equal(ethers.utils.parseEther("11"));
  });
});
