import React, { useContext } from "react";

import Arrow from "./Icons/Arrow";
import { BlocksContext } from "shared/useBlocks";
import Crunker from "crunker";
import DownloadButton from "./Icons/DownloadButton";
import PauseButton from "./Icons/PauseButton";
import PlayButton from "./Icons/PlayButton";
import { colors } from "shared/styles";
import styled from "@emotion/styled";
import useMediaPlayer from "shared/useMediaPlayer";

export default function MediaPlayer({ blob }: { blob: Blob }) {
  const { currentTime, duration, isPlaying, togglePlay, trackEnded } =
    useMediaPlayer(blob);
  const { nextTrack, previousTrack, blockWithTxns, startTxn } =
    useContext(BlocksContext);

  return (
    <MediaPlayerContainer id="media-player">
      <CanvasContainer id="canvas-container">
        <Canvas />
        <Spacer />
      </CanvasContainer>
      <Duration>
        <span>{currentTime || "--:--"}</span>
        <span>{duration || "--:--"}</span>
      </Duration>
      <Controls>
        {nextTrack ? (
          <ArrowButton direction="up" onClick={nextTrack} />
        ) : (
          <div />
        )}
        {isPlaying || trackEnded ? (
          <PauseButton onClick={togglePlay} />
        ) : (
          <PlayButton onClick={togglePlay} />
        )}
        {previousTrack ? (
          <ArrowButton direction="down" onClick={previousTrack} />
        ) : (
          <div />
        )}
      </Controls>
      <StyledDownloadButton
        onClick={() => {
          const crunker = new Crunker();
          console.log(blob);
          const blockHash = blockWithTxns.id;
          const blockSectionStart = startTxn;
          const blockSectionEnd =
            blockSectionStart +
            parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK);
          const fileName = `stark-block-hash-${blockHash}-txns-${blockSectionStart}-to-${blockSectionEnd}.mp3`;
          crunker.download(blob, fileName);
        }}
      />
    </MediaPlayerContainer>
  );
}
const StyledDownloadButton = styled(DownloadButton)`
  width: 8%;
  position: absolute;
  right: 0px;
  bottom: 50px;
  cursor: pointer;
`;

const MediaPlayerContainer = styled.div`
  width: 100%;
  padding: 1.5rem 0;
  position: relative;
`;

const CanvasContainer = styled.div`
  height: 130px;
  padding: 1rem 0;
  box-sizing: border-box;

  display: flex;
  flex-direction: row;

  overflow: auto;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none;
  }
`;

const Canvas = styled.canvas`
  height: 100%;
`;

const Spacer = styled.div`
  height: 100%;
  width: 100%;
  flex-shrink: 0;
`;

const Duration = styled.div`
  display: flex;
  color: ${colors.blue};
  align-items: center;
  justify-content: space-between;
  font-size: 20px;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 60%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 1rem;
`;

const ArrowButton = styled(Arrow)`
  user-select: none;
  cursor: pointer;
`;
