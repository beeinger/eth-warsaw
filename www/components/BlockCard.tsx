import React, { useContext, useEffect, useState } from "react";

import { BlocksContext } from "shared/useBlocks";
import MediaPlayer from "./MediaPlayer";
import cacheData from "memory-cache";
import { colors } from "shared/styles";
import getBlocksMusic from "shared/music";
import styled from "@emotion/styled";

const getKey = (blockWithTxns, startTxn) =>
    "stateRoot=" +
    blockWithTxns.stateRoot +
    "&start=" +
    startTxn +
    "&end=" +
    startTxn +
    parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK),
  getBlob = (blockWithTxns, startTxn) =>
    new Promise<Blob>((resolve) => {
      const key = getKey(blockWithTxns, startTxn);
      const blob = cacheData.get(key);
      if (blob) resolve(blob);
      else
        getBlocksMusic(
          blockWithTxns.stateRoot,
          blockWithTxns.txnsHashes,
          startTxn,
          startTxn + parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK)
        ).then(({ blob }) => {
          cacheData.put(key, blob);
          resolve(blob);
        });
    }),
  transactions_per_track = parseInt(
    process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK
  );

export default function BlockCard() {
  const { blockWithTxns, startTxn } = useContext(BlocksContext);
  const [blob, setBlob] = useState<Blob>();

  useEffect(() => {
    if (!blockWithTxns) return;
    // Get current track
    getBlob(blockWithTxns, startTxn).then((blob) => setBlob(blob));
    // Get next track
    getBlob(blockWithTxns, startTxn + transactions_per_track);
    // Get previous track
    if (startTxn >= transactions_per_track)
      getBlob(blockWithTxns, startTxn - transactions_per_track);
  }, [blockWithTxns, startTxn]);

  return (
    <Card>
      <Background />
      <Heading>
        Block:{" "}
        {typeof blockWithTxns?.number === "number"
          ? blockWithTxns?.number
          : "..."}
        , txns {typeof startTxn === "number" ? startTxn : "..."} -{" "}
        {typeof startTxn === "number"
          ? startTxn + parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK)
          : "..."}
      </Heading>
      <MediaPlayer blob={blob} />
    </Card>
  );
}

const linearGradient = `linear-gradient(
      45deg,
      ${colors.blue},
      ${colors.lightOrange},
      ${colors.orange},
      ${colors.red},
      ${colors.orange},
      ${colors.lightOrange},
      ${colors.blue}
    );`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: black;
  border-radius: 32px;
`;

const Card = styled.div`
  background: black;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  padding: 0 2rem;
  z-index: 1;

  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    background: ${linearGradient};
    background-size: 400%;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    z-index: -2;
    animation: animate 50s linear infinite;
    filter: blur(20px);
    border-radius: 32px;
  }

  @keyframes animate {
    0% {
      background-position: 0 0;
    }
    50% {
      background-position: 300% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
`;

const Heading = styled.div`
  color: ${colors.blue};
  font-size: 48px;
  font-weight: 600;
  margin: 2rem 0;
`;
