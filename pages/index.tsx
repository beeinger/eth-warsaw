import React, { useEffect } from "react";

import { Payload } from "shared/types";
import axios from "axios";
import dynamic from "next/dynamic";

const CreateMusic = dynamic(() => import("components/CreateMusic"), {
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
    <div>
      <div>{data?.blockId}</div>
      <div>{data?.txnsHashes?.[0]}</div>
      <CreateMusic data={data} />
    </div>
  );
}
