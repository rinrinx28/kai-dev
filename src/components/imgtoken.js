import { getItems } from "../api/serverapi";
import { useQuery } from "react-query";
// import fetch from "node-fetch";
// import { useState } from "react";

function ImgToken({ contract, tokenid }) {
  const img = useQuery("img-query", () => {
    return getItems(contract, tokenid);
  });
  // const [isImg, setImge] = useState();
  // fetch()
  return (
    <>
      {img.isSuccess === true ? (
        <img
          className="object-contain rounded block"
          style={{
            height: "48px",
            aspectRatio: "auto 48 / 48",
            width: "48px",
          }}
          src={`${img.data.metadata.image}`}
          alt={tokenid}
        />
      ) : (
        <img
          className="object-contain rounded block"
          style={{
            height: "48px",
            aspectRatio: "auto 48 / 48",
            width: "48px",
          }}
          src={`${tokenid}`}
          alt={tokenid}
        />
      )}
    </>
  );
}
export default ImgToken;
