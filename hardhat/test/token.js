const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();


    const initialSupply = ethers.parseUnits("1000000", 18); // for 1000 tokens with 18 decimals
    const hardhatToken = await ethers.deployContract("Token" , [initialSupply]);

    console.log(hardhatToken)
    console.log(hardhatToken.initialSupply)


    const ownerBalance = await hardhatToken.balanceOf(owner.address);
    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });
});