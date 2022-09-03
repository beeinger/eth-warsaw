import { Block, BlockWithTxns, Payload } from "shared/types";
import { createContext, useEffect, useMemo, useState } from "react";

import { api } from "shared";
import axios from "axios";
import { toast } from "react-toastify";
import useSWR from "swr";

export const BlocksContext = createContext<
  Partial<ReturnType<typeof useBlocks>>
>({});

export default function useBlocks() {
  const [blocksPage, setBlocksPage] = useState(1);
  const { data: blocks = [] } = useSWR<Block[]>(
    "/blocks?p=" + blocksPage,
    (key) => api.get(key).then((res) => res.data?.items || []),
    { refreshInterval: 60000 }
  );

  const [blockId, setBlockId] = useState<string>(),
    currentBlock = useMemo(
      () => (blockId ? blocks.find((block) => block.id === blockId) : null),
      [blocks, blockId]
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

  const [startTxn, setStartTxn] = useState(0);

  useEffect(() => {
    if (!blocks.length) return;
    if (!blockId) setBlockId(blocks[0].id);
    else toast.info("New block just came in!");
  }, [blocks]);

  function nextTrack() {
    if (!blockWithTxns) return;
    setStartTxn((prev) => {
      const nextStartTxn =
        prev + parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK);
      if (nextStartTxn >= blockWithTxns.txnCount) {
        const internalId = blocks.findIndex((block) => block.id === blockId);
        if (internalId < blocks.length - 1) {
          setBlockId(blocks[internalId + 1].id);
          return 0;
        } else {
          setBlocksPage((prev) => prev + 1);
          setBlockId(null);
          return 0;
        }
      } else return nextStartTxn;
    });
  }
  function previousTrack() {
    if (!blockWithTxns) return;
    setStartTxn((prev) => {
      const nextStartTxn =
        prev - parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK);
      if (nextStartTxn < 0) {
        const internalId = blocks.findIndex((block) => block.id === blockId);
        if (internalId >= 1) {
          setBlockId(blocks[internalId - 1].id);
          return (
            blocks[internalId - 1].txnCount -
            parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK)
          );
        } else {
          setBlocksPage((prev) => {
            if (prev > 0) {
              setBlockId(null);
              return prev - 1;
            } else return 0;
          });

          return 0;
        }
      } else return nextStartTxn;
    });
  }

  return {
    blockWithTxns: blockWithTxns as BlockWithTxns,
    startTxn,
    nextTrack,
    previousTrack,
  };
}
