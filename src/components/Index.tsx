import React, { ChangeEvent, useEffect, useState } from "react"
import Container from "./Container"
import { useEthereum } from "../hooks/useEthereum"
import { BaseContract, Contract, ethers } from "ethers";
import { token } from "../constants/constants";

interface TokenBalance {
    symbol: string
    balance: string
}

const Index: React.FC = () => {

    const { signer } = useEthereum();

    const [ethBalance, setEthBalance] = useState<string>("")
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([
        { symbol: "NaN", balance: "0.00" },
    ])

    const [address, setAddress] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")
    const [transferAmount, setTransferAmount] = useState<string>("")
    const [recipientAddress, setRecipientAddress] = useState<string>("")
    const [selectedToken, setSelectedToken] = useState<string>("ETH")


    const getContract = async (): Promise<Contract> => {
        return new ethers.Contract(token.tokenAddress, token.abi, signer);
    };



    const fetchBalance = async () => {
        if (signer) {
            if (signer.provider) {
                const _balance = await signer.provider.getBalance(await signer.getAddress());
                const balanceInEth = ethers.formatEther(_balance);

                setAddress(await signer.getAddress());

                const contract = await getContract();
                const _balanceToken = await contract.balanceOf(await signer.getAddress());
                const balanceInToken = ethers.formatUnits(_balanceToken, 18);
                const tokenSymbol = await contract.symbol();

                console.log("Balance in ETH:", balanceInToken);

                setEthBalance(parseFloat(balanceInEth).toFixed(3));

                const tokenBalance = parseFloat(balanceInToken).toFixed(2);
                setTokenBalances([{ symbol: tokenSymbol, balance: tokenBalance }]);

            }
        }
    };


    useEffect(() => {
        if (signer) {
            fetchBalance();
        }
    }, [signer]);

    useEffect(() => {
        const fetchAddress = async () => {
            const _address = await signer?.getAddress();
            if (_address) {
                setAddress(_address)
            }
        };
        fetchAddress();
    }, [])

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            if (!signer) {
                throw new Error("Please connect your wallet first!")
            }

            if (selectedToken === "ETH") {

                const balance = await signer.provider?.getBalance(await signer.getAddress());

                if (balance && balance < ethers.parseEther(transferAmount)) {
                    throw new Error("Insufficient balance to transfer")
                }

                const tx = {
                    to: recipientAddress,
                    value: ethers.parseEther(transferAmount),
                    gasLimit: BigInt(21000),
                    gasPrice: ethers.parseUnits("10", "gwei"),
                }

                const txTransfer = await signer?.sendTransaction(tx);
                console.log("Transaction Hash:", txTransfer?.hash);

                const receipt = await txTransfer?.wait();
                console.log("Transaction Receipt:", receipt);
                alert("Transaction successful!");

                fetchBalance();
                setTransferAmount("")
                setRecipientAddress("")
            }
            else {
                const contract = await getContract();

                const tx = await contract.transfer(recipientAddress, ethers.parseUnits(transferAmount, 18));
                console.log("Transaction Hash:", tx.hash);

                const receipt = await tx.wait();
                console.log("Transaction Receipt:", receipt);
                alert("Transaction successful!");

                fetchBalance();
                setTransferAmount("")
                setRecipientAddress("")
            }
        } catch (err) {
            setError("Failed to transfer tokens. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Container className="py-12">
            <div className="flex w-full flex-col gap-6 items-center justify-center max-w-4xl mx-auto">
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-2">Wallet Information</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">View your wallet details and balances</p>
                        <div className="space-y-4">
                            <div className="rounded-lg bg-gray-100 dark:bg-gray-700 p-4">
                                <div className="text-sm font-medium">Connected Address</div>
                                <div className="mt-1 font-mono text-xs">{address || "Not connected"}</div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h3 className="text-sm font-medium mb-2">ETH Balance</h3>
                                    <p className="text-2xl font-bold">{ethBalance || "0.00"} ETH</p>
                                </div>

                                {tokenBalances.map((token) => (
                                    <div
                                        key={token.symbol}
                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                                    >
                                        <h3 className="text-sm font-medium mb-2">{token.symbol} Balance</h3>
                                        <p className="text-2xl font-bold">
                                            {token.balance} {token.symbol}
                                        </p>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Transfer Form Card */}
                <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-2">Transfer Tokens</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Send tokens to another wallet address</p>
                        <form onSubmit={handleTransfer} className="space-y-4">
                            <div>
                                <label htmlFor="token" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Select Token
                                </label>
                                <select
                                    id="token"
                                    value={selectedToken}
                                    onChange={(e: ChangeEvent) => setSelectedToken((e.target as HTMLInputElement).value)}
                                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="ETH">ETH</option>
                                    <option value="STNK">STKN</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Amount
                                </label>
                                <input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={transferAmount}
                                    onChange={(e: ChangeEvent) => setTransferAmount((e.target as HTMLInputElement).value)}
                                    step="0.000001"
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="recipient"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Recipient Address
                                </label>
                                <input
                                    id="recipient"
                                    type="text"
                                    placeholder="0x..."
                                    value={recipientAddress}
                                    onChange={(e: ChangeEvent) => setRecipientAddress((e.target as HTMLInputElement).value)}
                                    required
                                    className="w-full px-3 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {error && (
                                <div
                                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                    role="alert"
                                >
                                    <strong className="font-bold">Error!</strong>
                                    <span className="block sm:inline"> {error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Transfering...
                                    </span>
                                ) : (
                                    "Send Tokens"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default Index

