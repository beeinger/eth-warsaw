import { useEffect, useState } from "react";

import drawAudio from "./drawAudio";

export default function useMediaPlayer(blob: Blob) {
  const [audio, setAudio] = useState<HTMLAudioElement>(undefined);
  const [currentTimeS, setCurrentTimeS] = useState<number>(0);
  const [durationS, setDurationS] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!blob) return;

    const timeout = setTimeout(() => {
      drawAudio(blob);
    }, 1000);

    const url = URL.createObjectURL(blob);
    var audio = new Audio(url);

    audio.addEventListener("canplay", () => {
      const durationS = audio.duration;
      setDurationS(durationS);
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

    return () => {
      audio.pause();
      timeout && clearTimeout(timeout);
    };
  }, [blob]);

  useEffect(() => {
    if (!audio) return;

    const interval = setInterval(() => {
      const currentTimeS = audio.currentTime;
      setCurrentTimeS(currentTimeS);
      const _currentTime = new Date(currentTimeS * 1000)
        .toISOString()
        .substring(14, 19);
      setCurrentTime(_currentTime);
    }, 500);

    return () => clearInterval(interval);
  }, [audio]);

  function togglePlay() {
    if (!audio) return;
    setIsPlaying((prev) => {
      prev ? audio.pause() : audio.play();
      return !prev;
    });
  }

  useEffect(() => {
    if (!audio) return;
    const width = document.querySelector("#canvas-container").scrollWidth;
    const widthPerSecond = width / durationS;
    const scrollTo = widthPerSecond * currentTimeS;
    document.querySelector("#canvas-container").scrollTo({
      top: 0,
      left: scrollTo,
      behavior: "smooth",
    });
  }, [currentTimeS, durationS]);

  return {
    currentTime,
    duration,
    isPlaying,
    togglePlay,
  };
}