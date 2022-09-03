import { useContext, useEffect, useState } from "react";

import { BlocksContext } from "./useBlocks";
import drawAudio from "./drawAudio";
import { toast } from "react-toastify";

export default function useMediaPlayer(blob: Blob) {
  const { nextTrack } = useContext(BlocksContext);
  const [audio, setAudio] = useState<HTMLAudioElement>(undefined);
  const [currentTimeS, setCurrentTimeS] = useState<number>(0);
  const [durationS, setDurationS] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackEnded, setTrackEnded] = useState(false);

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
      if (trackEnded) audio.play();
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
      nextTrack();
    });

    return () => {
      if (!trackEnded) audio.pause();
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
    trackEnded,
  };
}
