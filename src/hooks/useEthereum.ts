import { useContext } from "react";
import { EthereumContext, EthereumContextType } from "../context/EthereumContext";


export const useEthereum = (): EthereumContextType => {
    const contect = useContext(EthereumContext);
    if (!contect) {
        throw new Error("useEthereum must be used within a EthereumProvider");
    }

    return contect;
}