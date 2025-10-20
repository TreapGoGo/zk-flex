"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount, useSignMessage } from "wagmi";
import { PlusIcon, CameraIcon } from "@heroicons/react/24/outline";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract, useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { keccak256, toBytes } from "viem";

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
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStatus, setGenerationStatus] = useState<string>("");
  
  // 合约交互
  const { writeContractAsync: createInstance } = useScaffoldWriteContract("WealthProofRegistry");
  const { signMessageAsync } = useSignMessage();
  
  // 读取所有实例（用于获取最新创建的实例地址）
  const { data: allInstances, refetch: refetchInstances } = useScaffoldReadContract({
    contractName: "WealthProofRegistry",
    functionName: "getAllInstances",
  });
  
  // 读取实例快照
  // 注意：WealthProofInstance 是动态创建的，不在 deployedContracts.ts 中
  // 暂时禁用自动加载，等待实际实现
  const snapshot = null; // TODO: 实现读取快照
  
  // const { data: snapshot } = useScaffoldReadContract({
  //   contractName: "WealthProofInstance",
  //   address: instanceAddress || undefined,
  //   functionName: "getLatestSnapshot",
  // });
  
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
      await createInstance({
        functionName: "createProofInstance",
        args: [walletAddresses as `0x${string}`[]],
      });
      
      // 等待交易确认后，重新查询所有实例
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待 2 秒
      
      // 刷新实例列表
      const { data: updatedInstances } = await refetchInstances();
      
      // 获取最新创建的实例（数组最后一个）
      if (updatedInstances && updatedInstances.length > 0) {
        const latestInstance = updatedInstances[updatedInstances.length - 1];
        setInstanceAddress(latestInstance);
        console.log("Instance created:", latestInstance);
      }
      
      // 折叠 Step 1
      setIsStep1Collapsed(true);
      setIsCreating(false);
      
      alert("Instance created and auto-filled to Step 2!");
    } catch (error) {
      console.error("Error creating instance:", error);
      alert("Failed to create instance: " + (error as Error).message);
      setIsCreating(false);
    }
  };
  
  /**
   * 生成 ZK 证明
   */
  const handleGenerateProof = async () => {
    if (!connectedAddress) {
      alert("Please connect wallet first");
      return;
    }
    
    if (!instanceAddress) {
      alert("Please create instance first");
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      
      // Step 1: Sign message
      setGenerationStatus("Step 1/4: Signing message with MetaMask...");
      setGenerationProgress(10);
      
      const message = "ZK Flex Proof";
      const signature = await signMessageAsync({ message });
      
      setGenerationProgress(20);
      console.log("Signature:", signature);
      
      // Step 2: Load circuit files
      setGenerationStatus("Step 2/4: Loading circuit files...");
      
      const snarkjs = await import("snarkjs");
      
      setGenerationProgress(30);
      
      // Step 3: Build witness
      setGenerationStatus("Step 3/4: Building witness...");
      
      // 简化的 witness（实际需要复杂的数据转换）
      const witness = {
        // TODO: 实际需要将签名转换为 4x64-bit limbs
        // TODO: 需要从签名恢复公钥
        // 这里使用简化版本
      };
      
      setGenerationProgress(50);
      
      // Step 4: Generate proof
      setGenerationStatus("Step 4/4: Generating ZK proof (this may take 30-60s)...");
      
      // 实际证明生成（会很慢）
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        witness,
        "/circuits/wealth_proof.wasm",
        "/circuits/wealth_proof_final.zkey",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (progress: any) => {
          // 更新进度
          const percent = 50 + Math.floor(progress * 50);
          setGenerationProgress(percent);
        }
      );
      
      setGenerationProgress(100);
      setGenerationStatus("Complete!");
      
      // Download proof
      const proofData = { proof, publicSignals };
      const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "proof.json";
      a.click();
      
      alert("Proof generated and downloaded!");
      setIsGenerating(false);
      
    } catch (error) {
      console.error("Error generating proof:", error);
      alert("Failed to generate proof: " + (error as Error).message);
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStatus("");
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
              onClick={handleGenerateProof}
              disabled={!instanceAddress || isGenerating}
              className="btn btn-secondary btn-lg w-full"
            >
              {isGenerating ? (
                <>
                  <span className="loading loading-spinner"></span>
                  {generationStatus}
                </>
              ) : (
                "Generate ZK Proof"
              )}
            </button>
            
            {/* Progress Bar */}
            {isGenerating && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{generationStatus}</span>
                  <span>{generationProgress}%</span>
                </div>
                <progress 
                  className="progress progress-secondary w-full" 
                  value={generationProgress} 
                  max="100"
                ></progress>
              </div>
            )}
            
            {!isGenerating && (
              <div className="mt-4 text-sm text-base-content/60 space-y-1">
                <p>📋 What will happen:</p>
                <p>1. Sign message with MetaMask (~1s)</p>
                <p>2. Load circuit files: wasm (12MB) + zkey (919MB) (~5-10s)</p>
                <p>3. Generate ZK proof: ~1.88M constraints (~30-60s)</p>
                <p>4. Download proof.json (288 bytes)</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BobPage;

