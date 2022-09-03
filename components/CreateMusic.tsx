import React, { useEffect, useRef, useState } from "react";

import { Payload } from "shared/types";
import getBlocksMusic from "shared/music";

type Props = { data: Payload };

function chunkString(str): string[] {
  const chunks = Math.round(str.length / 1000);
  return str.match(new RegExp(`(.|[\r\n]){1,${chunks}}`, "g"));
}

const blobToFile = (theBlob: Blob, fileName: string): File => {
  var b: any = theBlob;
  b.lastModifiedDate = new Date();
  b.name = fileName;
  return theBlob as File;
};

export default function CreateMusic({ data }: Props) {
  const player = useRef<null | HTMLDivElement>(null);
  const [startTxn, setStartTxn] = useState(0);

  useEffect(() => {
    if (!data) return;

    getBlocksMusic(
      data.stateRoot,
      data.txnsHashes,
      startTxn,
      startTxn + 10
    ).then(async ({ element, blob, url }) => {
      if (player.current.firstChild)
        player.current.removeChild(player.current.lastChild);
      player.current.appendChild(element);
      {
        // const deta = axios.create({
        //   baseURL: `https://database.deta.sh/v1/${process.env.NEXT_PUBLIC_PROJECT_ID}/music`,
        //   headers: {
        //     "X-API-Key": process.env.NEXT_PUBLIC_PROJECT_KEY,
        //     "Content-Type": "application/json",
        //   },
        // });
        // var fr = new FileReader();
        // fr.onload = async function (e) {
        //   console.log(e.target.result);
        //   const chunks = chunkString(e.target.result);
        //   for (let i = 0; i < chunks.length; i++) {
        //     await deta.post("/items", {
        //       item: {
        //         part: i,
        //         totalParts: chunks.length,
        //         value: chunks[i],
        //       },
        //     });
        //   }
        //   console.log("done");
        // };
        // fr.readAsDataURL(blob);
        // console.log(blob);
        // var fr = new FileReader();
        // fr.onload = function (e) {
        //   console.log(e.target.result);
        // };
        // fr.readAsArrayBuffer(blob);
        // const deta = Deta(process.env.NEXT_PUBLIC_PROJECT_KEY);
        // const music = deta.Drive("music");
        // const result = await music.put(`${data.stateRoot}'s music.mp3`, {
        //   data: await blob
        //     .arrayBuffer()
        //     .then((arrayBuffer) => Buffer.from(arrayBuffer)),
        //   contentType: "audio/mp3",
        // });
        // console.log(result);
        // const deta = axios.create({
        //   baseURL: `https://drive.deta.sh/v1/${process.env.NEXT_PUBLIC_PROJECT_ID}/music`,
        //   headers: {
        //     "X-API-Key": process.env.NEXT_PUBLIC_PROJECT_KEY,
        //   },
        // });
        // const filename = `${data.stateRoot}'s music.mp3`;
        // const { upload_id } = await deta
        //   .post("/uploads?name=" + filename)
        //   .then((res) => res.data);
        // const url = `https://drive.deta.sh/v1/${process.env.NEXT_PUBLIC_PROJECT_ID}/music/uploads/${upload_id}/parts?name=${filename}&part=`;
        // var chunkCounter = 0;
        // //break into 5 MB chunks fat minimum
        // const chunkSize = 6000000;
        // // download the file
        // var file = blobToFile(blob, filename);
        // console.log(file.type);
        // console.log(file.name);
        // var numberofChunks = Math.ceil(file.size / chunkSize);
        // var start = 0;
        // var chunkEnd = start + chunkSize;
        // function updateProgress(oEvent) {
        //   if (oEvent.lengthComputable) {
        //     var percentComplete = Math.round(
        //       (oEvent.loaded / oEvent.total) * 100
        //     );
        //     var totalPercentComplete = Math.round(
        //       ((chunkCounter - 1) / numberofChunks) * 100 +
        //         percentComplete / numberofChunks
        //     );
        //     console.log(
        //       "Chunk # " +
        //         chunkCounter +
        //         " is " +
        //         percentComplete +
        //         "% uploaded. Total uploaded: " +
        //         totalPercentComplete +
        //         "%"
        //     );
        //     // ...
        //   } else {
        //     console.log("not computable");
        //     // Unable to compute progress information since the total size is unknown
        //   }
        // }
        // function uploadChunk(chunkForm, start, chunkEnd, upload_id) {
        //   var oReq = new XMLHttpRequest();
        //   oReq.upload.addEventListener("progress", updateProgress);
        //   oReq.open("POST", url + chunkCounter, true);
        //   var blobEnd = chunkEnd - 1;
        //   var contentRange = "bytes " + start + "-" + blobEnd + "/" + file.size;
        //   oReq.setRequestHeader("Content-Range", contentRange);
        //   oReq.setRequestHeader(
        //     "X-API-Key",
        //     process.env.NEXT_PUBLIC_PROJECT_KEY
        //   );
        //   oReq.setRequestHeader("Access-Control-Allow-Origin", "*");
        //   oReq.onload = function (oEvent) {
        //     // Uploaded.
        //     console.log("uploaded chunk");
        //     console.log("oReq.response", oReq.response);
        //     //now we have the video ID - loop through and add the remaining chunks
        //     //we start one chunk in, as we have uploaded the first one.
        //     //next chunk starts at + chunkSize from start
        //     start += chunkSize;
        //     //if start is smaller than file size - we have more to still upload
        //     if (start < file.size) {
        //       //create the new chunk
        //       createChunk(upload_id, start);
        //     } else {
        //       //the video is fully uploaded. there will now be a url in the response
        //       console.log("all uploaded!");
        //       deta
        //         .patch(`/uploads/${upload_id}?name=${filename}`)
        //         .then((res) => res.data)
        //         .then((res) => console.log(res));
        //     }
        //   };
        //   oReq.send(chunkForm);
        // }
        // function createChunk(upload_id, start) {
        //   chunkCounter++;
        //   console.log("created chunk: ", chunkCounter);
        //   chunkEnd = Math.min(start + chunkSize, file.size);
        //   const chunk = file.slice(start, chunkEnd);
        //   console.log(
        //     "i created a chunk of video" + start + "-" + chunkEnd + "minus 1	"
        //   );
        //   const chunkForm = new FormData();
        //   if (upload_id.length > 0) {
        //     //we have a videoId
        //     chunkForm.append("videoId", upload_id);
        //     console.log("added videoId");
        //   }
        //   chunkForm.append("file", chunk, filename);
        //   console.log("added file");
        //   //created the chunk, now upload iit
        //   uploadChunk(chunkForm, start, chunkEnd, upload_id);
        // }
        // //upload the first chunk to get the videoId
        // createChunk(upload_id, start);
        // const upload = await deta
        //   .post("/uploads?name=" + `${data.stateRoot}'s music.mp3`)
        //   // {
        //   //   "name": "file name",
        //   //   "upload_id": "a unique upload id"
        //   //   "project_id": "deta project id",
        //   //   "drive_name": "deta drive name"
        //   // }
        //   .then((resp) => resp.data);
        // you could also download it like that:
        // const crunker = new Crunker();
        // crunker.download(blob, `${data.blockId}'s music.mp3`);
      }
    });
  }, [data]);

  return (
    <div ref={player}>
      {/* The div below is removed when the music player loads */}
      {data && (
        <div>
          You're listening to Transactions {startTxn} - {startTxn + 10}
        </div>
      )}
      <div>Loading...</div>
    </div>
  );
}
