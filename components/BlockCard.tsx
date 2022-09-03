import React, { useContext, useEffect, useState } from "react";

import { BlocksContext } from "shared/useBlocks";
import MediaPlayer from "./MediaPlayer";
import getBlocksMusic from "shared/music";
import styled from "@emotion/styled";

export default function BlockCard() {
  const { blockWithTxns, startTxn } = useContext(BlocksContext);
  const [blob, setBlob] = useState<Blob>();

  useEffect(() => {
    if (!blockWithTxns) return;

    getBlocksMusic(
      blockWithTxns.stateRoot,
      blockWithTxns.txnsHashes,
      startTxn,
      startTxn + parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK)
    ).then(({ blob }) => setBlob(blob));
  }, [blockWithTxns, startTxn]);

  return (
    <Card>
      <Heading>
        Block: {blockWithTxns?.number}, txns {startTxn} -{" "}
        {startTxn + parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK)}
      </Heading>
      <MediaPlayer blob={blob} />
    </Card>
  );
}

const Card = styled.div`
  background-color: black;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
  width: 50%;
  padding: 0 2rem;

  -webkit-box-shadow: 8px 8px 24px 0px rgba(66, 68, 90, 1);
  -moz-box-shadow: 8px 8px 24px 0px rgba(66, 68, 90, 1);
  box-shadow: 8px 8px 24px 0px rgba(66, 68, 90, 1);
`;

const Heading = styled.div`
  color: #52e1ff;
  font-size: 48px;
  font-weight: 600;
  margin: 2rem 0;
`;
