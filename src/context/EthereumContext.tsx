import { ethers } from "ethers";
import { createContext } from "react";

export interface EthereumContextType {
    provider: ethers.BrowserProvider | null;
    signer: ethers.Signer | null;
    address: string | null;
    isAuthenticated: boolean;
    connectWallet: () => void;
    disconnectWallet: () => void;
    signMessage: (message: string) => Promise<string | undefined>;
    verifySignature: (message: string, signedMessage: string) => Promise<boolean>;
}


export const EthereumContext = createContext<EthereumContextType | undefined>(undefined);
