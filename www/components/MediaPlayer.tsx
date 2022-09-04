import { BsPauseCircleFill, BsPlayCircleFill } from "react-icons/bs";
import { CgPlayTrackNextO, CgPlayTrackPrevO } from "react-icons/cg";
import React, { useCallback, useContext, useEffect } from "react";

import { BlocksContext } from "shared/useBlocks";
import Crunker from "crunker";
import { TbFileDownload } from "react-icons/tb";
import { colors } from "shared/styles";
import styled from "@emotion/styled";
import { toast } from "react-toastify";
import useMediaPlayer from "shared/useMediaPlayer";
import { useStarknet, useStarknetInvoke } from "@starknet-react/core";

import { useL2Beat } from "shared/starknet/useL2Beat";

const downloadTrack = (blob, blockWithTxns, startTxn) => () => {
  const crunker = new Crunker();
  const blockHash = blockWithTxns.id;
  const blockSectionStart = startTxn;
  const blockSectionEnd =
    blockSectionStart +
    parseInt(process.env.NEXT_PUBLIC_TRANSACTIONS_PER_TRACK);
  const fileName = `stark-block-hash-${blockHash}-txns-${blockSectionStart}-to-${blockSectionEnd}.mp3`;
  crunker.download(blob, fileName);
};

export default function MediaPlayer({ blob }: { blob: Blob }) {
  const { currentTime, duration, isPlaying, togglePlay, trackEnded } =
    useMediaPlayer(blob);
  const { nextTrack, previousTrack, blockWithTxns, startTxn } =
    useContext(BlocksContext);

  const handleKeyEvent = useCallback(
    (e) => e.code === "Space" && togglePlay(),
    [togglePlay]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyEvent);
    return () => window.removeEventListener("keydown", handleKeyEvent);
  }, [togglePlay]);

  // ---

  const { account } = useStarknet();
  const { contract: l2Beat } = useL2Beat();
  const { invoke } = useStarknetInvoke<any>({
    contract: l2Beat,
    method: "mint",
  });

  const handleMint = () => {
    invoke({
      args: [blockWithTxns.stateRoot, startTxn, startTxn + 8],
      metadata: { method: "mint", message: "Mint song" },
    });
  };

  // ---

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
        <StyledMintButton
          onClick={
            account
              ? handleMint
              : () => toast.dark("To mint, connect your wallet!")
          }
          account={account}
        >
          mint
        </StyledMintButton>
        {previousTrack ? <NextButton onClick={previousTrack} /> : <div />}
        {isPlaying || trackEnded ? (
          <PauseButton onClick={togglePlay} />
        ) : (
          <PlayButton onClick={togglePlay} />
        )}
        {nextTrack ? <PreviousButton onClick={nextTrack} /> : <div />}
        <StyledDownloadButton
          onClick={downloadTrack(blob, blockWithTxns, startTxn)}
        />
      </Controls>
    </MediaPlayerContainer>
  );
}

const StyledDownloadButton = styled(TbFileDownload)`
  color: white;
  width: 40px;
  height: 40px;
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;

  :hover {
    color: ${colors.orange};
  }
`;

const StyledMintButton = styled.span<{ account: string }>`
  color: #ff875b;
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;

  :hover {
    color: ${colors.orange};
  }

  ${({ account }) => !account && `opacity: 0.5;`}
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
  justify-content: center;
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 1rem;
  gap: 1rem;
`;

const playPauseButtonStyles = `
  color: white;

  cursor: pointer;
  user-select: none;

  width: 50px;
  height: 50px;

  :hover{
    color: ${colors.orange};
  }
`;

const PlayButton = styled(BsPlayCircleFill)`
  ${playPauseButtonStyles}
`;
const PauseButton = styled(BsPauseCircleFill)`
  ${playPauseButtonStyles}
`;
const NextButton = styled(CgPlayTrackPrevO)`
  ${playPauseButtonStyles}
`;
const PreviousButton = styled(CgPlayTrackNextO)`
  ${playPauseButtonStyles}
`;
