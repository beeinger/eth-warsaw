import { Block, Payload } from "shared/types";
import React, { useEffect, useState } from "react";

import { api } from "shared";
import axios from "axios";
import dynamic from "next/dynamic";

const CreateMusic = dynamic(() => import("components/CreateMusic"), {
  ssr: false,
});

export default function index() {
  const [block, setBlock] = useState<Block>();
  const [data, setData] = React.useState<Payload>(null);

  useEffect(() => {
    api.get("/blocks").then((res) => {
      setBlock(res.data?.items?.[0] || "");
    });
  }, []);

  useEffect(() => {
    if (!block) return;
    axios
      .get("/api/blocks/" + block.id + "?stateRoot=" + block.stateRoot)
      .then((res) => {
        setData(res.data);
      });
  }, [block]);

  return (
    <div>
      {block && <div>Current block: {block.stateRoot}</div>}
      <CreateMusic data={data} />
    </div>
  );
}
