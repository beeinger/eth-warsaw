import { useContext, useEffect, useState } from "react";

import { BlocksContext } from "./useBlocks";
import drawAudio from "./drawAudio";

export default function useMediaPlayer(blob: Blob) {
  const { nextTrack } = useContext(BlocksContext);
  const [audio, setAudio] = useState<HTMLAudioElement>(undefined);
  const [durationS, setDurationS] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackEnded, setTrackEnded] = useState(false);
  const [canvasContainer, setCanvasContainer] = useState<Element>(undefined);
  const [canvas, setCanvas] = useState<HTMLCanvasElement>(undefined);
  const [stateInterval, setStateInterval] = useState<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const container = document.querySelector("#canvas-container");
    const canvas = document.querySelector("canvas");
    setCanvasContainer(container);
    setCanvas(canvas);

    container.addEventListener("scroll", scroll);

    return () => {
      container.removeEventListener("scroll", scroll);
    };
  });

  useEffect(() => {
    if (!blob) return;

    const timeout = setTimeout(() => {
      drawAudio(blob);
    }, 1000);

    const url = URL.createObjectURL(blob);
    var audio = new Audio(url);

    const onAudioReady = () => {
      const durationS = audio.duration;
      setDurationS(durationS);
      const _duration = new Date(durationS * 1000)
        .toISOString()
        .substring(14, 19);
      setDuration(_duration);
      setAudio(audio);
      if (trackEnded) playMusic();
      setTrackEnded(false);
    };

    audio.addEventListener("canplay", onAudioReady);
    audio.addEventListener("loadedmetadata", () => !duration && onAudioReady());

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("play", () => {
      setIsPlaying(true);
    });

    audio.addEventListener("ended", () => {
      setTrackEnded(true);
      nextTrack?.();
    });

    return () => {
      if (!trackEnded) pauseMusic(audio);
      timeout && clearTimeout(timeout);
    };
  }, [blob]);

  function setReadableTime(seconds: number) {
    const _currentTime = new Date(seconds * 1000)
      .toISOString()
      .substring(14, 19);
    setCurrentTime(_currentTime);
  }

  function playMusic() {
    if (!audio) return;

    if (trackEnded) clearInterval(stateInterval);

    audio.play();

    const interval = setInterval(() => {
      const currentTimeS = audio.currentTime;
      scrollCanvasContainer(currentTimeS, durationS);
      setReadableTime(currentTimeS);
    }, 100);

    setStateInterval(interval);
  }

  function pauseMusic(audio: HTMLAudioElement) {
    audio.pause();
    clearInterval(stateInterval);
  }

  function togglePlay() {
    if (!audio) return;
    setIsPlaying((prev) => {
      prev ? pauseMusic(audio) : playMusic();
      return !prev;
    });
  }

  function scrollCanvasContainer(
    currentTimeSeconds: number,
    durationSeconds: number
  ) {
    if (!audio) return;
    const width = document.querySelector("canvas").scrollWidth;
    const widthPerSecond = width / durationSeconds;
    const scrollTo = widthPerSecond * currentTimeSeconds;
    document.querySelector("#canvas-container").scrollTo({
      top: 0,
      left: scrollTo,
      behavior: "smooth",
    });
  }

  function scroll() {
    if (!audio || !canvas || isPlaying) return;

    const newCurrentTimeS = Number(
      ((durationS / canvas.scrollWidth) * canvasContainer.scrollLeft).toFixed(1)
    );

    setReadableTime(newCurrentTimeS);

    audio.currentTime = newCurrentTimeS;
  }

  return {
    currentTime,
    duration,
    isPlaying,
    togglePlay,
    trackEnded,
  };
}
