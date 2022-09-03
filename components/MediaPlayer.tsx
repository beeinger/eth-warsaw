import React, { useEffect, useState } from "react";

import drawAudio from "../shared/drawAudio";
import styled from "@emotion/styled";

interface MediaPlayerProps {
  blob: Blob;
}

export default function MediaPlayer({ blob }: MediaPlayerProps) {
  const [blobState, setBlobState] = useState(undefined);
  useEffect(() => {
    if (!blob) return;
    drawAudio(blob);
    setBlobState(blob);
  }, [blob]);

  function play(blob: Blob) {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    var audio = new Audio(url);
    audio.play();
  }

  return (
    <MediaPlayerContainer id="media-player">
      <Canvas />
      <button onClick={() => play(blobState)}>Play</button>
    </MediaPlayerContainer>
  );
}

const MediaPlayerContainer = styled.div`
  background: #282831;
  width: 100%;
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const Canvas = styled.canvas`
  width: fit-content;
  height: 130px;
  margin: 2rem auto;
`;
