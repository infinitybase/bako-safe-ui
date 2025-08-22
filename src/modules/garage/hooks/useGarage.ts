import { useMemo } from "react";

import { useWallet } from "@fuels/react";
import { MarketplaceContract } from "@garage/sdk";

export const useGarage = () => {
    const { wallet } = useWallet();

    const marketplace = useMemo(
        // @ts-ignore
        () => MarketplaceContract.create(wallet!),
        [wallet]
    );

    return marketplace;
};
