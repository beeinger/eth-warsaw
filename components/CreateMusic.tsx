import React, { useEffect, useRef } from "react";

import { Payload } from "shared/types";
import getBlocksMusic from "shared/music";

type Props = { data: Payload };

export default function CreateMusic({ data }: Props) {
  const player = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (!data) return;

    getBlocksMusic(data.blockId, data.txnsHashes).then(({ element, blob }) => {
      if (player.current.firstChild)
        player.current.removeChild(player.current.firstChild);
      player.current.appendChild(element);

      console.log(blob);

      // you could also download it like that:
      // const crunker = new Crunker();
      // crunker.download(blob, `${data.blockId}'s music.mp3`);
    });
  }, [data]);

  return (
    <div ref={player}>
      {/* The div below is removed when the music player loads */}
      <div>Loading...</div>
    </div>
  );
}
