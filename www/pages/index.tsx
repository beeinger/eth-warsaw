import useBlocks, { BlocksContext } from "shared/useBlocks";

import { ConnectWallet } from "components/ConnectWallet";
import React from "react";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";

const BlockCard = dynamic(() => import("components/BlockCard"), {
  ssr: false,
});

export default function index() {
  const blocks = useBlocks();

  return (
    <BlocksContext.Provider value={blocks}>
      <Layout>
        <BlockCard />
      </Layout>
      <ConnectWallet />
    </BlocksContext.Provider>
  );
}

export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;
