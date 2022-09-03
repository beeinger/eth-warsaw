import React, { useMemo, useState } from "react";

import { BlocksContext } from "shared/useBlocks";
import { Layout } from "pages";
import { Payload } from "shared/types";
import { api } from "shared";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import useSWR from "swr";

const BlockCard = dynamic(() => import("components/BlockCard"), {
  ssr: false,
});

export default function index() {
  const {
    query: { blockId, start = "0" },
  } = useRouter();

  const { data: currentBlock = null } = useSWR<any>(
      blockId ? "/block/" + blockId : null,
      (key) =>
        api.get(key).then((res) => ({
          ...res.data.header,
          number: res.data.header.sequence,
        }))
    ),
    { data: currentBlockData = null } = useSWR<Payload>(
      currentBlock ? "/api/blocks/" + currentBlock.id : null,
      (key) =>
        axios.get(key).then((res) => ({
          ...(res.data as Omit<Payload, "stateRoot">),
          stateRoot: currentBlock.stateRoot,
        }))
    ),
    blockWithTxns = useMemo(
      () =>
        currentBlock && currentBlockData
          ? { ...currentBlock, ...currentBlockData }
          : null,
      [currentBlock, currentBlockData]
    );

  return (
    <BlocksContext.Provider
      value={{
        blockWithTxns,
        startTxn: parseInt(start as string) || 0,
      }}
    >
      <Layout>
        <BlockCard />
      </Layout>
    </BlocksContext.Provider>
  );
}
