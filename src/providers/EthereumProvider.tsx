import React, { useEffect } from "react";
import { ethers } from "ethers";
import { ReactNode, useState } from "react";
import { EthereumContext } from "../context/EthereumContext";

declare global {
    interface Window {
        ethereum: any;
    }
}


interface EthereumProviderProps {
    children: ReactNode
}

export const EthereumProvider: React.FC<EthereumProviderProps> = ({ children }) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const connectWallet = async () => {
        if (window.ethereum) {
            const _provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(_provider);
            const _signer = await _provider.getSigner();
            const _address = await _signer.getAddress();

            setSigner(_signer);
            setAddress(_address);
        } else {
            alert("Please install MetaMask");
        }
    };

    const disconnectWallet = () => {
        setProvider(null);
        setSigner(null);
        setAddress(null);
        setIsAuthenticated(false);
        localStorage.removeItem("session");
    };

    const signMessage = async (message: string): Promise<string | undefined> => {
        if (!signer) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            const signature = await signer.signMessage(message);
            console.log("Signed Message:", message);
            console.log("Signature:", signature);
            return signature;
        } catch (error) {
            console.error("Error signing the message:", error);
            return undefined;
        }
    };

    const verifySignature = async (message: string, signedMessage: string): Promise<boolean> => {
        try {
            const signerAddress = ethers.verifyMessage(message, signedMessage);
            console.log("Verified Address:", signerAddress);

            if (signerAddress.toLowerCase() === address?.toLowerCase()) {
                localStorage.setItem("session", JSON.stringify({ address: signerAddress, message, signedMessage }));
                setIsAuthenticated(true);
                return true;
            } else {
                alert("Signature verification failed.");
                return false;
            }
        } catch (error) {
            console.error("Error verifying signature:", error);
            return false;
        }
    };

    useEffect(() => {
        const session = localStorage.getItem("session");
        if (session) {
            const { address: sessionAddress, message, signedMessage } = JSON.parse(session);

            const isValidSession = ethers.verifyMessage(message, signedMessage) === sessionAddress;
            if (isValidSession) {
                setAddress(sessionAddress);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem("session");
            }
        }
    }, []);

    return (
        <EthereumContext.Provider
            value={{
                provider,
                signer,
                address,
                isAuthenticated,
                connectWallet,
                disconnectWallet,
                signMessage,
                verifySignature,
            }}
        >
            {children}
        </EthereumContext.Provider>
    );
};

