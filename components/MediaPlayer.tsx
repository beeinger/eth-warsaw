import React, { useContext } from "react";

import Arrow from "./Icons/Arrow";
import { BlocksContext } from "shared/useBlocks";
import PauseButton from "./Icons/PauseButton";
import PlayButton from "./Icons/PlayButton";
import { colors } from "shared/styles";
import styled from "@emotion/styled";
import useMediaPlayer from "shared/useMediaPlayer";

export default function MediaPlayer({ blob }: { blob: Blob }) {
  const { currentTime, duration, isPlaying, togglePlay } = useMediaPlayer(blob);
  const { nextTrack, previousTrack } = useContext(BlocksContext);

  return (
    <MediaPlayerContainer id="media-player">
      <CanvasContainer id="canvas-container">
        <Canvas />
      </CanvasContainer>
      <Duration>
        <span>{currentTime || "--:--"}</span>
        <span>{duration || "--:--"}</span>
      </Duration>
      <Controls>
        <ArrowButton direction="up" onClick={nextTrack} />
        {isPlaying ? (
          <PauseButton onClick={togglePlay} />
        ) : (
          <PlayButton onClick={togglePlay} />
        )}
        <ArrowButton direction="down" onClick={previousTrack} />
      </Controls>
    </MediaPlayerContainer>
  );
}

const MediaPlayerContainer = styled.div`
  width: 100%;
  padding: 1.5rem 0;
`;

const CanvasContainer = styled.div`
  height: 130px;
  padding: 1rem 0;
  box-sizing: border-box;

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
