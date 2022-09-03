import React, { useEffect, useState } from "react";

import Arrow from "./Icons/Arrow";
import PauseButton from "./Icons/PauseButton";
import PlayButton from "./Icons/PlayButton";
import drawAudio from "../shared/drawAudio";
import styled from "@emotion/styled";

interface MediaPlayerProps {
  blob: Blob;
}

export default function MediaPlayer({ blob }: MediaPlayerProps) {
  const [audio, setAudio] = useState<HTMLAudioElement>(undefined);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleIsPlaying = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!blob) return;
    drawAudio(blob);
    const url = URL.createObjectURL(blob);
    var audio = new Audio(url);

    audio.addEventListener("canplay", () => {
      const durationS = audio.duration;
      const _duration = new Date(durationS * 1000)
        .toISOString()
        .substring(14, 19);
      setDuration(_duration);
      setAudio(audio);
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("play", () => {
      setIsPlaying(true);
    });

    return () => audio.pause();
  }, [blob]);

  useEffect(() => {
    if (!audio) return;

    const interval = setInterval(() => {
      const currentTimeS = audio.currentTime;
      const _currentTime = new Date(currentTimeS * 1000)
        .toISOString()
        .substring(14, 19);
      setCurrentTime(_currentTime);
    }, 500);

    return () => clearInterval(interval);
  }, [audio]);

  function togglePlay() {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    toggleIsPlaying();
  }

  return (
    <MediaPlayerContainer id="media-player">
      <CanvasContainer>
        <Canvas />
      </CanvasContainer>
      <Duration>
        <span>{currentTime}</span>
        <span>{duration}</span>
      </Duration>
      <Controls>
        <Arrow direction="up" />
        {isPlaying ? (
          <PauseButton onClick={togglePlay} />
        ) : (
          <PlayButton onClick={togglePlay} />
        )}
        <Arrow direction="down" />
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
  color: #52e1ff;
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
