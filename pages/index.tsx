import { Block, Payload } from "shared/types";
import React, { useEffect, useState } from "react";

import { api } from "shared";
import axios from "axios";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";

const BlockCard = dynamic(() => import("components/BlockCard"), {
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
      // .get(
      //   "/api/blocks/" +
      //     "0x1ea06cd202ddf4b521582829d01886689f07d2a6af709101b170dfcee02e76" +
      //     "?stateRoot=" +
      //     "0x03cfea9b28970594973f1f44d7fbc7962018d61a6c7b28236eb23caade0eaad4"
      // )
      .then((res) => {
        setData(res.data);
      });
  }, [block]);

  return (
    <Layout>
      <BlockCard data={data} block={block} />
    </Layout>
  );
}

const Layout = styled.div`
  background: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;
