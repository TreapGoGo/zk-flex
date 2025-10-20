"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { PlusIcon, CameraIcon } from "@heroicons/react/24/outline";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";

/**
 * Bob 页面 - 创建钱包池实例 + 生成 ZK 证明
 */
const BobPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  
  // 状态管理
  const [walletAddresses, setWalletAddresses] = useState<string[]>(Array(32).fill(""));
  const [instanceAddress, setInstanceAddress] = useState<string>("");
  const [walletIndex, setWalletIndex] = useState<number>(15);
  const [threshold, setThreshold] = useState<string>("10");
  const [isStep1Collapsed, setIsStep1Collapsed] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  
  // 合约交互
  const { writeContractAsync: createInstance } = useScaffoldWriteContract("WealthProofRegistry");
  
  // 读取实例快照（如果已创建）
  const { data: snapshot } = useScaffoldReadContract({
    contractName: "WealthProofInstance",
    address: instanceAddress || undefined,
    functionName: "getLatestSnapshot",
  });
  
  /**
   * 处理创建实例
   */
  const handleCreateInstance = async () => {
    try {
      setIsCreating(true);
      
      // 验证地址
      const validAddresses = walletAddresses.filter(addr => addr && addr.startsWith("0x"));
      if (validAddresses.length !== 32) {
        alert("Please input exactly 32 valid addresses");
        setIsCreating(false);
        return;
      }
      
      // 调用合约创建实例
      const tx = await createInstance({
        functionName: "createProofInstance",
        args: [walletAddresses as `0x${string}`[]],
      });
      
      // 等待交易确认获取实例地址
      // 注意：createInstance 返回 address，需要从事件中获取
      // 暂时使用一个 mock 地址，实际应该从交易 receipt 的事件中解析
      
      // TODO: 从交易 receipt 的 InstanceCreated 事件中获取实例地址
      // const receipt = await tx.wait();
      // const event = receipt.events.find(e => e.event === 'InstanceCreated');
      // const newInstanceAddress = event.args.instance;
      
      // 临时：从已知的部署地址推断（Demo 时可用）
      // 实际应该从事件中获取
      const mockInstanceAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // 替换为实际地址
      
      setInstanceAddress(mockInstanceAddress);
      setIsStep1Collapsed(true);
      setIsCreating(false);
      
      alert(`Instance created! Address: ${mockInstanceAddress}`);
    } catch (error) {
      console.error("Error creating instance:", error);
      alert("Failed to create instance: " + (error as Error).message);
      setIsCreating(false);
    }
  };
  
  /**
   * 使用测试地址填充
   */
  const fillTestAddresses = () => {
    const testAddresses = [
      // Anvil default accounts
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
      "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955",
      "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
      "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    ];
    
    const newAddresses = [...walletAddresses];
    for (let i = 0; i < Math.min(9, 32); i++) {
      newAddresses[i] = testAddresses[i];
    }
    
    // Fill rest with placeholder
    for (let i = 9; i < 32; i++) {
      if (!newAddresses[i]) {
        newAddresses[i] = `0x${(i + 1000).toString(16).padStart(40, '0')}`;
      }
    }
    
    setWalletAddresses(newAddresses);
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Bob: Prove Your Wealth
            </span>
          </h1>
          <p className="text-lg text-base-content/70">
            Create a wallet pool and generate zero-knowledge proofs
          </p>
          {connectedAddress && (
            <div className="mt-4">
              <span className="text-sm text-base-content/60">Connected as: </span>
              <Address address={connectedAddress} />
            </div>
          )}
        </div>

        {/* Step 1: Create Instance */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title text-2xl">
                <PlusIcon className="h-6 w-6" />
                Step 1: Create Wallet Pool Instance
                {instanceAddress && <span className="badge badge-success ml-2">✓ Created</span>}
              </h2>
              {instanceAddress && (
                <button 
                  onClick={() => setIsStep1Collapsed(!isStep1Collapsed)}
                  className="btn btn-ghost btn-sm"
                >
                  {isStep1Collapsed ? "Show ▼" : "Hide ▲"}
                </button>
              )}
            </div>
            
            {/* 可折叠内容 */}
            {!isStep1Collapsed && (
              <>
                <div className="alert alert-info mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <div>
                    <p className="font-semibold">Input 32 wallet addresses</p>
                    <p className="text-sm">Mix your real wallet (Bob_real) with 31 public addresses (like Vitalik, DAOs, etc.)</p>
                  </div>
                </div>

                {/* Test Data Button */}
                <button 
                  onClick={fillTestAddresses}
                  className="btn btn-outline btn-sm mb-4"
                >
                  Fill with Test Addresses
                </button>

                {/* Address Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {walletAddresses.map((addr, index) => (
                    <div key={index} className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-xs">Address [{index}]</span>
                      </label>
                      <AddressInput
                        value={addr}
                        onChange={(value) => {
                          const newAddresses = [...walletAddresses];
                          newAddresses[index] = value;
                          setWalletAddresses(newAddresses);
                        }}
                        placeholder={`Address ${index}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Create Instance Button */}
                <button
                  onClick={handleCreateInstance}
                  disabled={!connectedAddress || isCreating}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isCreating ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Creating Instance...
                    </>
                  ) : (
                    "Create Wallet Pool Instance"
                  )}
                </button>
              </>
            )}
            
            {/* 折叠后显示的摘要 */}
            {isStep1Collapsed && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <p className="font-semibold">Instance Created!</p>
                  <p className="text-sm">32 addresses added to pool</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Generate Proof */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <CameraIcon className="h-6 w-6" />
              Step 2: Generate ZK Proof
            </h2>

            <div className="alert alert-warning mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              <div>
                <p className="font-semibold">Coming Soon!</p>
                <p className="text-sm">ZK proof generation requires ~919MB circuit files and snarkjs integration</p>
                <p className="text-sm">Proof generation will take 30-60 seconds</p>
              </div>
            </div>

            {/* Instance Address Input - 自动填充 */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Instance Address</span>
                {instanceAddress && (
                  <span className="label-text-alt text-success">Auto-filled from Step 1</span>
                )}
              </label>
              <AddressInput
                value={instanceAddress}
                onChange={setInstanceAddress}
                placeholder="0x... (will auto-fill after Step 1)"
              />
            </div>

            {/* Proof Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Wallet Index (0-31)</span>
                  <span className="label-text-alt">Your position in the pool</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="31"
                  value={walletIndex}
                  onChange={(e) => setWalletIndex(parseInt(e.target.value))}
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Threshold (ETH)</span>
                  <span className="label-text-alt">Minimum balance to prove</span>
                </label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="input input-bordered"
                  placeholder="10000"
                />
              </div>
            </div>

            {/* Snapshot Display */}
            {snapshot && (
              <div className="alert alert-success mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <p className="font-semibold">Snapshot Found!</p>
                  <p className="text-sm">Block: {snapshot.blockNumber?.toString()}</p>
                </div>
              </div>
            )}

            {/* Generate Proof Button */}
            <button
              disabled
              className="btn btn-secondary btn-lg w-full"
              title="Proof generation coming soon - requires snarkjs integration"
            >
              Generate ZK Proof (Coming Soon)
            </button>
            
            <div className="mt-4 text-sm text-base-content/60 space-y-1">
              <p>📋 What will happen:</p>
              <p>1. Sign message with MetaMask (~1s)</p>
              <p>2. Load circuit files: wasm (12MB) + zkey (919MB) (~5-10s)</p>
              <p>3. Generate ZK proof: ~1.88M constraints (~30-60s)</p>
              <p>4. Download proof.json (288 bytes)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BobPage;

