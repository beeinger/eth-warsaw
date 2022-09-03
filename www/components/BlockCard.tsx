import React, { useContext, useEffect, useState } from "react";

import { BlocksContext } from "shared/useBlocks";
import { FaRegShareSquare } from "react-icons/fa";
import MediaPlayer from "./MediaPlayer";
import cacheData from "memory-cache";
import { colors } from "shared/styles";
import getBlocksMusic from "shared/music";
import styled from "@emotion/styled";
import { toast } from "react-toastify";

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

const truncateHash = (hash) => hash.slice(0, 5) + "..." + hash.slice(-5);

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
        {/* copy to clipboard */}
        <div
          onClick={() => {
            navigator.clipboard.writeText(
              "https://stark-techno.mooon.team/track/" +
                blockWithTxns.id +
                "?start=" +
                startTxn
            );
            toast.dark("Copied to clipboard!");
          }}
        >
          <div>
            <div>
              {blockWithTxns?.id ? truncateHash(blockWithTxns?.id) : "..."}
            </div>
            <SmallerText>transactions:</SmallerText>
            <SmallerText>
              {typeof startTxn === "number" ? startTxn : "..."} -{" "}
              {typeof startTxn === "number"
                ? startTxn +
                  parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK)
                : "..."}
            </SmallerText>
          </div>
          <StyledCopyButton />
        </div>
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

const SmallerText = styled.div`
  font-size: 16px;
  color: white;
`;

const Heading = styled.div`
  color: ${colors.blue};
  font-size: 48px;
  font-weight: 600;
  margin-top: 2rem;

  > div {
    display: flex;
    margin-right: -56px;
    cursor: pointer;

    :hover,
    :hover ${SmallerText} {
      color: ${colors.orange};
    }

    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

const StyledCopyButton = styled(FaRegShareSquare)`
  color: currentColor;
  width: 40px;
  height: 40px;
  cursor: pointer;

  margin-left: 32px;
`;
