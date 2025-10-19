"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { DocumentArrowUpIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

/**
 * Alice 页面 - 验证 ZK 证明
 */
const AlicePage: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  
  // 状态管理
  const [instanceAddress, setInstanceAddress] = useState<string>("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [threshold, setThreshold] = useState<string>("10");
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  
  // 读取实例信息
  const { data: snapshot } = useScaffoldReadContract({
    contractName: "WealthProofInstance",
    address: instanceAddress || undefined,
    functionName: "getLatestSnapshot",
  });
  
  const { data: walletPool } = useScaffoldReadContract({
    contractName: "WealthProofInstance",
    address: instanceAddress || undefined,
    functionName: "getWalletPool",
  });

  /**
   * 处理文件上传
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
    }
  };

  /**
   * 处理验证证明
   */
  const handleVerifyProof = async () => {
    if (!proofFile || !instanceAddress) {
      alert("Please upload proof and set instance address");
      return;
    }

    try {
      // 读取 proof.json
      const proofText = await proofFile.text();
      const proofData = JSON.parse(proofText);
      
      // TODO: 调用合约验证
      // const result = await verifyProof({...});
      
      alert("Proof verification coming soon - requires contract integration");
      
    } catch (error) {
      console.error("Error verifying proof:", error);
      alert("Failed to verify proof");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Alice: Verify Wealth Proof
            </span>
          </h1>
          <p className="text-lg text-base-content/70">
            Upload a zero-knowledge proof and verify it on-chain (FREE!)
          </p>
          {connectedAddress && (
            <div className="mt-4">
              <span className="text-sm text-base-content/60">Connected as: </span>
              <Address address={connectedAddress} />
            </div>
          )}
        </div>

        {/* Step 1: Upload Proof */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <DocumentArrowUpIcon className="h-6 w-6" />
              Step 1: Upload Proof
            </h2>

            {/* Instance Address */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Instance Address</span>
                <span className="label-text-alt">From Bob</span>
              </label>
              <AddressInput
                value={instanceAddress}
                onChange={setInstanceAddress}
                placeholder="0x... (Instance contract address)"
              />
            </div>

            {/* File Upload */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Proof File (proof.json)</span>
                <span className="label-text-alt">288 bytes</span>
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="file-input file-input-bordered w-full"
              />
              {proofFile && (
                <label className="label">
                  <span className="label-text-alt text-success">
                    ✓ {proofFile.name} ({proofFile.size} bytes)
                  </span>
                </label>
              )}
            </div>

            {/* Threshold */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Threshold (ETH)</span>
                <span className="label-text-alt">Minimum balance claimed</span>
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
        </div>

        {/* Step 2: Preview Instance Data */}
        {snapshot && walletPool && (
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">
                Instance Data Preview
              </h2>

              <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">Snapshot Block</div>
                  <div className="stat-value text-primary">{snapshot.blockNumber?.toString()}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Addresses in Pool</div>
                  <div className="stat-value text-secondary">32</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Anonymity Set</div>
                  <div className="stat-value text-accent">3.125%</div>
                  <div className="stat-desc">1/32 guess probability</div>
                </div>
              </div>

              <div className="divider">Wallet Pool (first 5)</div>

              <div className="space-y-2">
                {walletPool.slice(0, 5).map((addr: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-base-200 rounded-lg">
                    <span className="text-sm font-mono text-base-content/60">[{i}]</span>
                    <Address address={addr} />
                  </div>
                ))}
                <div className="text-center text-base-content/40 py-2">... 27 more addresses ...</div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Verify */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-4">
              <CheckBadgeIcon className="h-6 w-6" />
              Step 2: Verify Proof
            </h2>

            <div className="alert alert-info mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <p className="font-semibold">FREE Verification</p>
                <p className="text-sm">Calling a VIEW function - no gas cost, instant result</p>
              </div>
            </div>

            <button
              onClick={handleVerifyProof}
              disabled={!proofFile || !instanceAddress}
              className="btn btn-secondary btn-lg w-full"
            >
              Verify Proof (FREE)
            </button>

            {/* Verification Result */}
            {verificationResult !== null && (
              <div className={`alert ${verificationResult ? 'alert-success' : 'alert-error'} mt-4`}>
                <div>
                  <h3 className="font-bold">
                    {verificationResult ? '✓ Proof Valid!' : '✗ Proof Invalid'}
                  </h3>
                  {verificationResult ? (
                    <div className="text-sm mt-2 space-y-1">
                      <p>✓ Someone in the 32-address pool</p>
                      <p>✓ Has balance >= {threshold} ETH</p>
                      <p>✗ You don't know WHO</p>
                      <p>✗ You don't know their EXACT balance</p>
                    </div>
                  ) : (
                    <p className="text-sm mt-2">The proof could not be verified</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-lg">How Verification Works</h3>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li>• Frontend parses proof.json</li>
              <li>• Calls instance.verifyProof() (view function)</li>
              <li>• Groth16Verifier validates the ZK proof</li>
              <li>• Checks public inputs match the snapshot</li>
              <li>• Returns true/false (no gas cost!)</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AlicePage;

