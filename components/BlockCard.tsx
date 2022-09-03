import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import getBlocksMusic from "shared/music";
import { Payload } from "shared/types";
import MediaPlayer from "./MediaPlayer";

type Props = { data: Payload };

export default function BlockCard({ data }: Props) {
  const [blob, setBlob] = useState<Blob>(undefined);
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
