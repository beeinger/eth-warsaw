import type { NextApiRequest, NextApiResponse } from "next";
import { Payload, Transaction } from "shared/types";

import { api } from "shared";
import cacheData from "memory-cache";

const getTxns = (blockId, p, items) =>
  api
    .get(`/txns?block=${blockId}&ps=50&p=${p}`)
    .then((resp) => resp.data)
    .then((data) => {
      const newItems = [...items, ...data.items] as Transaction[];
      return data.lastPage === p ? newItems : getTxns(blockId, p + 1, newItems);
    });

export default async (req: NextApiRequest, res: NextApiResponse<Payload>) => {
  const { blockId, stateRoot } = req.query as {
    blockId: string;
    stateRoot: string;
  };
  if (!blockId || !stateRoot) return res.status(400).end();
  let payload = null;

  if (blockId !== "pending") payload = cacheData.get(blockId);

  console.log("Was from cache: ", !!payload);

  if (!payload) {
    payload = await getTxns(blockId, 1, []).then((items) => ({
      stateRoot,
      txnsHashes: items.map((txn) => txn.hash),
    }));

    blockId !== "pending" && cacheData.put(blockId, payload);
  }
  res.status(200).json(payload);
};
