import { getItems } from "../api/serverapi";
import { useState, useEffect } from "react";
import WebSocket from "ws";

const webSocket = new WebSocket("ws://localhost:3001/nfts/");

function ImgToken({ metadata, tokenid, contract }) {
  const [isImg, setImg] = useState(tokenid);
  useEffect(() => {
    getItems(contract, tokenid).then((res) => {
      // console.log(res);
      // console.log(res);
      setImg(res.metadata.image);
    });
  }, []);
  return (
    <>
      <img
        className="object-contain rounded block"
        style={{
          height: "48px",
          aspectRatio: "auto 48 / 48",
          width: "48px",
        }}
        src={`${isImg}`}
        alt={tokenid}
      />
    </>
  );
}
export default ImgToken;
