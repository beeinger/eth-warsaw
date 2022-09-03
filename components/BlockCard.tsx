import { Block, Payload } from "shared/types";
import React, { useEffect, useState } from "react";

import MediaPlayer from "./MediaPlayer";
import getBlocksMusic from "shared/music";
import styled from "@emotion/styled";

type Props = { data: Payload; block: Block };

export default function BlockCard({ data, block }: Props) {
  const [blob, setBlob] = useState<Blob>();
  const [startTxn, setStartTxn] = useState(0);

  useEffect(() => {
    if (!data) return;

    getBlocksMusic(
      data.stateRoot,
      data.txnsHashes,
      startTxn,
      startTxn + 10
    ).then(({ element, blob }) => setBlob(blob));
  }, [data]);

  return (
    <Card>
      <Heading>Block: 2137</Heading>
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
