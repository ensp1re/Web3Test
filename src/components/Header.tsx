import React from "react"
import Container from "./Container"
import { useEthereum } from "../hooks/useEthereum"

const Header: React.FC = () => {
    const { address, connectWallet, disconnectWallet, signMessage, verifySignature, isAuthenticated } = useEthereum();

    const handleSignIn = async () => {
        const message = "Sign this message to authenticate."; // Customize message
        const signature = await signMessage(message);

        if (signature) {
            const isVerified = await verifySignature(message, signature);
            if (isVerified) {
                alert("Successfully authenticated!");
            }
        }
    };

    return (
        <header className="py-2 bg-white border-b border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Container>
                <div className="py-2 flex gap-2 w-full justify-between items-center">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-800 bg-clip-text text-transparent">Web3 Test</h1>
                    {isAuthenticated ? (
                        <div className="flex gap-2 items-center">
                            <span className="text-gray-700 font-medium bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text">
                                Authenticated as: <span className="font-bold">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
                            </span>
                            <button onClick={disconnectWallet} className="bg-red-500 rounded-xl text-white p-2 hover:bg-red-600 cursor-pointer transition duration-300">
                                Disconnect
                            </button>
                        </div>
                    ) : address ? (
                        <button onClick={handleSignIn} className="bg-green-500 rounded-xl  hover:bg-green-600 cursor-pointer transition duration-300 text-white p-2">
                            Sign In
                        </button>
                    ) : (
                        <button onClick={connectWallet} className="bg-blue-500 rounded-xl hover:bg-blue-600 cursor-pointer transition duration-300 text-white p-2">
                            Connect Wallet
                        </button>
                    )}
                </div>
            </Container>
        </header>
    );
};

export default Header

