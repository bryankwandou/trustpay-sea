const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying TrustPay SEA Smart Contracts...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // Deploy TrustPayEscrow
  const feeRecipient = deployer.address; // Change this for production
  console.log("\n📄 Deploying TrustPayEscrow...");
  
  const TrustPayEscrow = await hre.ethers.getContractFactory("TrustPayEscrow");
  const escrow = await TrustPayEscrow.deploy(feeRecipient);
  await escrow.waitForDeployment();

  const escrowAddress = await escrow.getAddress();
  console.log("✅ TrustPayEscrow deployed to:", escrowAddress);

  // Get network info
  const network = await hre.ethers.provider.getNetwork();
  console.log("\n🌐 Network:", network.name, `(Chain ID: ${network.chainId})`);

  // Add supported tokens based on network
  console.log("\n🪙 Setting up supported tokens...");
  
  const tokenAddresses = {
    // Polygon Mainnet
    137: {
      usdc: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
      usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    },
    // Polygon Mumbai
    80001: {
      usdc: "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23"
    },
    // Base Mainnet
    8453: {
      usdc: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    },
    // Base Sepolia
    84532: {
      usdc: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
    },
    // Arbitrum One
    42161: {
      usdc: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      usdt: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
    },
    // Lisk Sepolia Testnet
    4202: {
      // No official stablecoins yet - will deploy mock tokens
    },
    // Lisk Mainnet
    1135: {
      // Add official token addresses when available
    },
    // Local Hardhat
    31337: {}
  };

  const chainId = Number(network.chainId);
  const tokens = tokenAddresses[chainId] || {};

  for (const [symbol, address] of Object.entries(tokens)) {
    if (address) {
      const tx = await escrow.setSupportedToken(address, true);
      await tx.wait();
      console.log(`  ✅ Added ${symbol.toUpperCase()}: ${address}`);
    }
  }

  // For local network or Lisk Sepolia testnet, deploy mock tokens
  if (chainId === 31337 || chainId === 4202) {
    console.log("\n🧪 Test network detected, deploying mock tokens...");
    
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    
    // Deploy Mock USDC
    const mockUSDC = await MockERC20.deploy("Mock USDC", "USDC", 6);
    await mockUSDC.waitForDeployment();
    const usdcAddress = await mockUSDC.getAddress();
    console.log("  ✅ Mock USDC deployed to:", usdcAddress);
    
    // Deploy Mock USDT
    const mockUSDT = await MockERC20.deploy("Mock USDT", "USDT", 6);
    await mockUSDT.waitForDeployment();
    const usdtAddress = await mockUSDT.getAddress();
    console.log("  ✅ Mock USDT deployed to:", usdtAddress);
    
    // Add to supported tokens
    await escrow.setSupportedToken(usdcAddress, true);
    await escrow.setSupportedToken(usdtAddress, true);
    
    // Mint test tokens to deployer
    await mockUSDC.mint(deployer.address, hre.ethers.parseUnits("100000", 6));
    await mockUSDT.mint(deployer.address, hre.ethers.parseUnits("100000", 6));
    console.log("  💵 Minted 100,000 USDC and USDT to deployer");
    
    // Output token addresses for config
    console.log("\n📋 UPDATE src/lib/contracts/config.ts with:");
    console.log(`  liskSepolia: {`);
    console.log(`    escrow: "${escrowAddress}",`);
    console.log(`    usdc: "${usdcAddress}",`);
    console.log(`    usdt: "${usdtAddress}"`);
    console.log(`  }`);
  }

  // Deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log(`Network:           ${network.name} (${chainId})`);
  console.log(`TrustPayEscrow:    ${escrowAddress}`);
  console.log(`Fee Recipient:     ${feeRecipient}`);
  console.log(`Platform Fee:      2%`);
  console.log("=".repeat(60));

  // Verify contract on block explorer (if not local)
  if (chainId !== 31337) {
    console.log("\n⏳ Waiting for block confirmations before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

    try {
      console.log("🔍 Verifying contract on block explorer...");
      await hre.run("verify:verify", {
        address: escrowAddress,
        constructorArguments: [feeRecipient],
      });
      console.log("✅ Contract verified!");
    } catch (error) {
      console.log("⚠️ Verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Update CONTRACT_ADDRESSES in src/lib/contracts/config.ts");
  console.log("2. Test the deployment with npm run test");
  console.log("3. Configure your frontend to use the deployed address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
