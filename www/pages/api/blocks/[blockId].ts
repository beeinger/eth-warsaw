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

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Omit<Payload, "stateRoot">>
) => {
  const { blockId } = req.query as {
    blockId: string;
  };
  if (!blockId) return res.status(400).end();
  let payload = null;

  if (blockId !== "pending") payload = cacheData.get(blockId);

  console.log("Was from cache: ", !!payload);

  if (!payload) {
    payload = await getTxns(blockId, 1, []).then((items) => ({
      txnsHashes: items.map((txn) => txn.hash),
    }));

    blockId !== "pending" && cacheData.put(blockId, payload);
  }
  res.status(200).json(payload);
};
