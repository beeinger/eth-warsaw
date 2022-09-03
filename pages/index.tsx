import React, { useEffect } from "react";

import { Payload } from "shared/types";
import axios from "axios";
import dynamic from "next/dynamic";
import styled from "@emotion/styled";

const BlockCard = dynamic(() => import("components/BlockCard"), {
  ssr: false,
});

export default function index() {
  const [data, setData] = React.useState<Payload>(null);

  useEffect(() => {
    axios
      .get(
        "/api/blocks/0x789f28819f696ecfd08fa6964209ae471729d9a4f9d1c2dfb6ce48c1faf671a"
      )
      .then((res) => {
        setData(res.data);
      });
  }, []);

  return (
    <Layout>
      <BlockCard data={data} />
    </Layout>
  );
}

const Layout = styled.div`
  background: #29296e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;
