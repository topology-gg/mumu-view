import "../styles/globals.css";
import { StarknetConfig, InjectedConnector } from "@starknet-react/core";
import { SequencerProvider } from "starknet";
import { SIMULATOR_ADDR } from "../src/components/SimulatorContract";
import ControllerConnector from "@cartridge/connector";

function MyApp({ Component, pageProps }) {
    const connectors = [
        new InjectedConnector({ options: { id: "braavos" } }),
        new InjectedConnector({ options: { id: "argentX" } }),
        //  Pre-approve all tx to method "simulator"
        new ControllerConnector([
            {
                method: "simulator",
                target: SIMULATOR_ADDR,
            },
        ], {
            url: "https://keychain-git-removenextrouting.preview.cartridge.gg/",
        }),
    ];

    const testnet1 = "https://alpha4.starknet.io/";
    const testnet2 = "https://alpha4-2.starknet.io/";

    return (
        <StarknetConfig connectors={connectors} defaultProvider={new SequencerProvider({ baseUrl: testnet1 })}>
            <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
            <Component {...pageProps} />
        </StarknetConfig>
    );
}

export default MyApp;
