import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import getBlocksMusic from "shared/music";
import { Payload } from "shared/types";
import MediaPlayer from "./MediaPlayer";

type Props = { data: Payload };

export default function BlockCard({ data }: Props) {
  const [blob, setBlob] = useState(undefined);
  useEffect(() => {
    if (!data) return;

    getBlocksMusic(data.blockId, data.txnsHashes).then(({ element, blob }) => {
      setBlob(blob);
    });
  }, [data]);

  return (
    <Card>
      <Heading>Block: 2137</Heading>
      <MediaPlayer blob={blob} />
    </Card>
  );
}

const Card = styled.div`
  background-color: white;
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
  width: 50%;
`;

const Heading = styled.div`
  font-size: 48px;
`;
