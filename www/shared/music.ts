import Crunker from "crunker";

const sizes = [
  [27, 32, 27, 18],
  [16, 18, 36, 20],
  [24, 30, 32, 40],
  [34, 28, 42, 28],
  [25, 12, 12, 6],
];

const hashCharCodeUsableValue = (payload: string) => {
  const charCode = payload.charCodeAt(0);
  if (charCode < 58) return charCode - 48;
  else return charCode - (97 - 10);
};

const pairwiseProd = (arr: number[]) => {
  let final = [];
  // balancing extra 0s
  let was0 = false;

  for (let i = 0; i + 1 < arr.length; i++) {
    if (was0) {
      if (arr[i] === 0) {
        was0 = false;
        final.push(arr[i + 1]);
        continue;
      } else if (arr[i + 1] === 0) {
        was0 = false;
        final.push(arr[i]);
        continue;
      }
    }
    if (arr[i] === 0 || arr[i + 1] === 0) was0 = true;
    final.push(arr[i] * arr[i + 1]);
  }
  return final;
};

const vote = (
  possibleOutcomes: number,
  payload: string,
  expand: boolean = false
) => {
  let votes = payload.split("").map((v) => hashCharCodeUsableValue(v));
  if (expand) votes = pairwiseProd(votes);
  votes = votes.reduce(
    (acc, curr) => [...acc, Math.floor(curr % possibleOutcomes)],
    []
  );

  let outcomes = [];
  for (let i = 0; i < possibleOutcomes; i++)
    outcomes.push([i, votes.filter((outcome) => outcome === i).length]);
  outcomes.sort((a, b) => b[1] - a[1]);

  return outcomes[0][0];
};

const getBeat = (stateRoot: string) => {
  const firstVote = vote(
      4,
      stateRoot.slice(2).slice(0, (stateRoot.length - 2) / 2)
    ),
    secondVote = vote(
      sizes[2][firstVote],
      stateRoot.slice(2).slice((stateRoot.length - 2) / 2),
      true
    );

  return { path: `/${firstVote}/2/${secondVote}.mp3`, firstVote };
};

const getOtherPaths = (firstVote: number, txnHash) =>
  [0, 1, 4].map((category) => [
    `/${firstVote}/${category}/${vote(
      sizes[category][firstVote],
      txnHash.slice(2).slice(0, (txnHash.length - 2) / 2),
      true
    )}.mp3`,
    `/${firstVote}/3/${vote(
      sizes[3][firstVote],
      txnHash.slice(2).slice((txnHash.length - 2) / 2),
      true
    )}.mp3`,
  ]);

const getBlocksMusic = (
  stateRoot: string,
  txnsHashes: string[],
  txnsFrom: number,
  txnsTo: number
) => {
  const { path: beatPath, firstVote } = getBeat(stateRoot);

  const crunker = new Crunker();

  let beatPaths = [beatPath, beatPath, beatPath, beatPath, beatPath];
  if (firstVote === 2) beatPaths = [...beatPaths, ...beatPaths];

  return Promise.all(
    txnsHashes.slice(txnsFrom || 0, txnsTo || undefined).map((txnHash) => {
      const otherPaths = getOtherPaths(firstVote, txnHash);
      return Promise.all(
        otherPaths.map((paths) =>
          crunker
            .fetchAudio(...paths)
            .then((buffers) => crunker.mergeAudio(buffers))
        )
      )
        .then((buffers) => crunker.concatAudio(buffers))
        .then((buffer) =>
          crunker
            .fetchAudio(...beatPaths)
            .then((buffers) => crunker.concatAudio(buffers))
            .then((second_buffer) =>
              crunker.mergeAudio([buffer, second_buffer])
            )
        );
    })
  ).then((buffers) => {
    const { element, blob, url } = crunker.export(
      crunker.concatAudio(buffers || []),
      "audio/mp3"
    );
    return { element, blob, url };
  });
};

export default getBlocksMusic;
