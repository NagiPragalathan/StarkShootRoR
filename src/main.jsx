import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SlideApp from "./components/SlideApp";
import Result from "./components/Result.jsx";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "../store/store";
import Lobby from "./components/Lobby";
import Options from "./components/Options";
import StoreOptions from "./components/StoreOption";
import Home from "./components/Home.jsx";
import { ThirdwebProvider } from "thirdweb/react";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import { PersistGate } from "redux-persist/integration/react";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthersExtension } from "@dynamic-labs/ethers-v5";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

import GunSelectionScreen from "./components/NewStore/GunSelectionScreen.jsx";
import CharacterSelectionScreen from "./components/NewStore/CharacterSelectionScreen.jsx";

const huddleClient = new HuddleClient({
  projectId: "yn1GSFecK63Bm7pRiiuBuUUQQhWmpJM3",
  options: {
    activeSpeakers: {
      size: 12,
    },
  },
});

import { StarknetWalletConnectors } from "@dynamic-labs/starknet";
import { HuddleClient, HuddleProvider } from "@huddle01/react";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <HuddleProvider key="huddle01-provider" client={huddleClient}>
            <Router>

              <Routes>
                <Route path="/" exact element={<Lobby />} />
                <Route path="/lobby" exact element={<Lobby />} />
                <Route path="/game" exact element={<App />} />
                <Route path="/result" exact element={<Result />} />
                <Route
                  path="/Character"
                  exact
                  element={<SlideApp data={"1"} />}
                />
                <Route
                  path="/guns"
                  exact
                  element={<GunSelectionScreen />}
                />
                <Route
                  path="/characters"
                  exact
                  element={<CharacterSelectionScreen />}
                />
                <Route
                  path="/Car"
                  exact
                  element={<SlideApp data={"3"} />}
                />
                <Route path="/options" exact element={<Options />} />
                <Route path="/optstore" exact element={<StoreOptions />} />
              </Routes>

            </Router>
          </HuddleProvider>
        </PersistGate>
      </Provider>
    </Suspense>
  </React.StrictMode>
);
