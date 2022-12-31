import "./collection.css";
import { useParams } from "react-router-dom";
import MetaTag from "../components/metaTags";
import Navbar from "./navboard";
import React, { useState } from "react";
import moment from "moment";
import "./collection.css";
import {
  getCollectionstt,
  getCollectionnew,
  getListed,
  getSold,
  updateCollection,
  getItems,
} from "../api/serverapi";
import { RiFileCopyLine } from "react-icons/ri";
import ReactTooltip from "react-tooltip";
import { BsGlobe, BsTwitter } from "react-icons/bs";
import { SiDiscord } from "react-icons/si";
import eth from "../image/eth.svg";
import weth from "../image/weth.svg";
import opensea_dark from "../image/opensea_dark.svg";
import { useQuery } from "react-query";
import { ethers } from "ethers";
import { Cross as Hamburger } from "hamburger-react";
import { Lines, Bars } from "../chart/linechart";
import ImgToken from "../components/imgtoken";
import { ToastContainer, toast } from "react-toast";

function Collection() {
  const [copy, setCopy] = useState("Copy");
  const [filter, setFilter] = useState("1D");
  const [isOpen, setOpen] = useState(false);
  const [isOutlier, setOutlier] = useState(false);
  const { name } = useParams();
  const handleMetaToast = () => {
    toast.warn("Collection Not Update, please wait for a minute");
  };

  //! ——————————————————[Start useQuery]——————————————————
  const collections = useQuery("get-collectionstt", () => {
    return getCollectionstt(name);
  });
  if (collections.isSuccess === true) {
    if (collections.data[0].update_stt === 0) {
      handleMetaToast();
      getCollectionnew(name).then((data) => {
        var collection = data.collection;
        var featured_image_url = collection.image_url;
        var banner_image_url = collection.banner_image_url;
        var external_url = collection.external_url;
        var discord_url = collection.discord_url;
        var twitter_username = collection.twitter_username;
        var slug = collection.slug;
        var collection_name = collection.name;
        getItems(name.toLocaleLowerCase(), 1).then((items) => {
          var tokenuri = items.tokenUri.gateway;
          var arrayString = tokenuri.split("/");
          var metadata = arrayString.slice(0, arrayString.length - 1).join("/");
          updateCollection(
            name,
            featured_image_url,
            banner_image_url,
            external_url,
            discord_url,
            twitter_username,
            slug,
            collection_name,
            metadata,
          );
        });
        setTimeout(() => window.location.reload(), 5 * 1e3);
      });
    }
  }
  const listing = useQuery(
    "get-listed",
    () => {
      return getListed(name.toLocaleLowerCase());
    },
    { refetchInterval: 10000 },
  );
  const sold = useQuery(
    "get-sold",
    () => {
      return getSold(name);
    },
    { refetchInterval: 10000 },
  );
  if (listing.isSuccess) {
    // console.log(listing.data);
  }
  var option_select = [
    { value: "1D", label: "1D" },
    { value: "3D", label: "3D" },
    { value: "7D", label: "7D" },
    { value: "14D", label: "14D" },
    { value: "30D", label: "30D" },
    { value: "All", label: "All" },
  ];
  //! ——————————————————[End useQuery]——————————————————

  return (
    <div className="collection">
      <Navbar />
      {collections.isSuccess === true ? (
        <div
          className="h-96 w-full bg-cover bg-center bg-white/50"
          style={{
            backgroundImage: `url("${
              collections.data[0].banner.split("=")[0] + "=1920&auto=format"
            }")`,
          }}
        ></div>
      ) : null}
      <div className="p-8 ">
        <div className="flex flex-wrap justify-between items-center gap-2">
          {collections.data?.map((v, i) => (
            <div className="flex" key={i}>
              <img
                alt={v.collection_name}
                src={v.profile}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  borderColor: "white",
                  borderStyle: "solid",
                  borderWidth: "2px",
                }}
              />
              <div className="flex flex-col ml-4 w-[100%] gap-2 items-start">
                <div className="flex items-center w-[100%] justify-start">
                  <h5 className="text-white text-2xl font-normal">
                    {v.collection_name}
                  </h5>
                </div>
                <div
                  className="flex items-center hover:bg-slate-500/20 cursor-pointer"
                  aria-label={copy}
                  data-tip
                  data-for="copy"
                  onClick={() => {
                    setCopy("Copied");
                    navigator.clipboard.writeText(`${v.collection_adr}`);
                    setTimeout(() => {
                      setCopy("Copy");
                    }, 1e3 * 5);
                  }}
                >
                  <p className="text-white/50">
                    {v.collection_adr.slice(0, 8 - 1) +
                      "..." +
                      v.collection_adr.slice(
                        v.collection_adr.length - 8,
                        v.collection_adr.length,
                      )}
                  </p>
                  <RiFileCopyLine
                    size={20}
                    color="rgb(255 255 255 / 0.5)"
                    className="ml-2 rotate-180"
                  />
                </div>
                <ReactTooltip
                  id="copy"
                  place="bottom"
                  effect="solid"
                  getContent={[
                    () => {
                      return copy;
                    },
                    1000,
                  ]}
                />
                <div className="flex gap-4 mt-1 items-center justify-center">
                  <div className="flex gap-4">
                    <a
                      href={`https://opensea.io/collection/${v.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 90 90"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M45 0C20.151 0 0 20.151 0 45C0 69.849 20.151 90 45 90C69.849 90 90 69.849 90 45C90 20.151 69.858 0 45 0ZM22.203 46.512L22.392 46.206L34.101 27.891C34.272 27.63 34.677 27.657 34.803 27.945C36.756 32.328 38.448 37.782 37.656 41.175C37.323 42.57 36.396 44.46 35.352 46.206C35.217 46.458 35.073 46.71 34.911 46.953C34.839 47.061 34.713 47.124 34.578 47.124H22.545C22.221 47.124 22.032 46.773 22.203 46.512ZM74.376 52.812C74.376 52.983 74.277 53.127 74.133 53.19C73.224 53.577 70.119 55.008 68.832 56.799C65.538 61.38 63.027 67.932 57.402 67.932H33.948C25.632 67.932 18.9 61.173 18.9 52.83V52.56C18.9 52.344 19.08 52.164 19.305 52.164H32.373C32.634 52.164 32.823 52.398 32.805 52.659C32.706 53.505 32.868 54.378 33.273 55.17C34.047 56.745 35.658 57.726 37.395 57.726H43.866V52.677H37.467C37.143 52.677 36.945 52.299 37.134 52.029C37.206 51.921 37.278 51.813 37.368 51.687C37.971 50.823 38.835 49.491 39.699 47.97C40.284 46.944 40.851 45.846 41.31 44.748C41.4 44.55 41.472 44.343 41.553 44.145C41.679 43.794 41.805 43.461 41.895 43.137C41.985 42.858 42.066 42.57 42.138 42.3C42.354 41.364 42.444 40.374 42.444 39.348C42.444 38.943 42.426 38.52 42.39 38.124C42.372 37.683 42.318 37.242 42.264 36.801C42.228 36.414 42.156 36.027 42.084 35.631C41.985 35.046 41.859 34.461 41.715 33.876L41.661 33.651C41.553 33.246 41.454 32.868 41.328 32.463C40.959 31.203 40.545 29.97 40.095 28.818C39.933 28.359 39.753 27.918 39.564 27.486C39.294 26.82 39.015 26.217 38.763 25.65C38.628 25.389 38.52 25.155 38.412 24.912C38.286 24.642 38.16 24.372 38.025 24.111C37.935 23.913 37.827 23.724 37.755 23.544L36.963 22.086C36.855 21.888 37.035 21.645 37.251 21.708L42.201 23.049H42.219C42.228 23.049 42.228 23.049 42.237 23.049L42.885 23.238L43.605 23.436L43.866 23.508V20.574C43.866 19.152 45 18 46.413 18C47.115 18 47.754 18.288 48.204 18.756C48.663 19.224 48.951 19.863 48.951 20.574V24.939L49.482 25.083C49.518 25.101 49.563 25.119 49.599 25.146C49.725 25.236 49.914 25.38 50.148 25.56C50.337 25.704 50.535 25.884 50.769 26.073C51.246 26.46 51.822 26.955 52.443 27.522C52.605 27.666 52.767 27.81 52.92 27.963C53.721 28.71 54.621 29.583 55.485 30.555C55.728 30.834 55.962 31.104 56.205 31.401C56.439 31.698 56.7 31.986 56.916 32.274C57.213 32.661 57.519 33.066 57.798 33.489C57.924 33.687 58.077 33.894 58.194 34.092C58.554 34.623 58.86 35.172 59.157 35.721C59.283 35.973 59.409 36.252 59.517 36.522C59.85 37.26 60.111 38.007 60.273 38.763C60.327 38.925 60.363 39.096 60.381 39.258V39.294C60.435 39.51 60.453 39.744 60.471 39.987C60.543 40.752 60.507 41.526 60.345 42.3C60.273 42.624 60.183 42.93 60.075 43.263C59.958 43.578 59.85 43.902 59.706 44.217C59.427 44.856 59.103 45.504 58.716 46.098C58.59 46.323 58.437 46.557 58.293 46.782C58.131 47.016 57.96 47.241 57.816 47.457C57.609 47.736 57.393 48.024 57.168 48.285C56.97 48.555 56.772 48.825 56.547 49.068C56.241 49.437 55.944 49.779 55.629 50.112C55.449 50.328 55.251 50.553 55.044 50.751C54.846 50.976 54.639 51.174 54.459 51.354C54.144 51.669 53.892 51.903 53.676 52.11L53.163 52.569C53.091 52.641 52.992 52.677 52.893 52.677H48.951V57.726H53.91C55.017 57.726 56.07 57.339 56.925 56.61C57.213 56.358 58.482 55.26 59.985 53.604C60.039 53.541 60.102 53.505 60.174 53.487L73.863 49.527C74.124 49.455 74.376 49.644 74.376 49.914V52.812V52.812Z"
                          fill="#E5E8EB"
                        />
                      </svg>
                    </a>
                    <a
                      href={`https://etherscan.io/address/${v.collection_adr}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 293.775 293.667"
                      >
                        <g
                          id="etherscan-logo-light-circle"
                          transform="translate(-219.378 -213.333)"
                        >
                          <path
                            id="Path_1"
                            data-name="Path 1"
                            d="M280.433,353.152A12.45,12.45,0,0,1,292.941,340.7l20.737.068a12.467,12.467,0,0,1,12.467,12.467v78.414c2.336-.692,5.332-1.43,8.614-2.2a10.389,10.389,0,0,0,8.009-10.11V322.073a12.469,12.469,0,0,1,12.467-12.47h20.779a12.47,12.47,0,0,1,12.467,12.47v90.276s5.2-2.106,10.269-4.245a10.408,10.408,0,0,0,6.353-9.577V290.9a12.466,12.466,0,0,1,12.465-12.467h20.779A12.468,12.468,0,0,1,450.815,290.9v88.625c18.014-13.055,36.271-28.758,50.759-47.639a20.926,20.926,0,0,0,3.185-19.537,146.6,146.6,0,0,0-136.644-99.006c-81.439-1.094-148.744,65.385-148.736,146.834a146.371,146.371,0,0,0,19.5,73.45,18.56,18.56,0,0,0,17.707,9.173c3.931-.346,8.825-.835,14.643-1.518a10.383,10.383,0,0,0,9.209-10.306V353.152"
                            transform="translate(0 0)"
                            fill="#fff"
                          />
                          <path
                            id="Path_2"
                            data-name="Path 2"
                            d="M244.417,398.641A146.808,146.808,0,0,0,477.589,279.9c0-3.381-.157-6.724-.383-10.049-53.642,80-152.686,117.405-232.79,128.793"
                            transform="translate(35.564 80.269)"
                            fill="#bfcfda"
                          />
                        </g>
                      </svg>
                    </a>
                    <hr className="ml-2 items-stretch h-auto border-solid border-white border-opacity-30 border" />
                    {v.website !== null ? (
                      <a href={`${v.website}`} target="_blank" rel="noreferrer">
                        <BsGlobe color="rgb(255 255 255)" size={20} />
                      </a>
                    ) : null}
                    {v.twitter !== null ? (
                      <a
                        href={`https://twitter.com/${v.twitter}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <BsTwitter color="rgb(255 255 255)" size={20} />
                      </a>
                    ) : null}
                    {v.discord !== null ? (
                      <a href={`${v.discord}`} target="_blank" rel="noreferrer">
                        <SiDiscord color="rgb(255 255 255)" size={20} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr className="items-stretch h-auto border-solid border-white shadow-white border-opacity-30 border" />
      <div className="grow text-white justify-center items-center">
        <div className=" relative flex-auto w-full">
          <div className="flex">
            <button className="items-center justify-center box-border flex-1 bg-transparent cursor-pointer min-h-[59px] min-w-[90px] px-2 py-3 font-thin max-w-none uppercase border-b-2 border-gray-400">
              Liveview
            </button>
            <button className="items-center justify-center box-border flex-1 bg-transparent cursor-pointer min-h-[59px] min-w-[90px] px-2 py-3 font-thin max-w-none uppercase">
              Liveview2
              <span></span>
            </button>
            <button className="items-center justify-center box-border flex-1 bg-transparent cursor-pointer min-h-[59px] min-w-[90px] px-2 py-3 font-thin max-w-none uppercase">
              Liveview3
              <span></span>
            </button>
            <button className="items-center justify-center box-border flex-1 bg-transparent cursor-pointer min-h-[59px] min-w-[90px] px-2 py-3 font-thin max-w-none uppercase">
              Liveview4
              <span></span>
            </button>
          </div>
        </div>
        <div className="flex flex-row mt-2">
          <div className="basis-1/4 flex-grow-0 p-2 border border-gray-500 rounded-xl m-2">
            {listing.isSuccess === true ? (
              <div className="flex-col">
                <div className="flex flex-row flex-wrap justify-between">
                  <div className="h-12 m-2">
                    <div className="flex-col flex">
                      <span className="uppercase font-semibold text-sm">
                        listings
                      </span>
                      <p className="text-xs text-[#0FFF50] flex">
                        Feed is live
                        <span className="h-2 w-2 ml-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FFF50] ">
                            <span className="animate-ping inline-flex h-full w-full rounded-full bg-[#0FFF50] opacity-75"></span>
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-[600px] ">
                  <div className="overflow-auto will-change-transform h-full scrollbar-hide">
                    <div className="overflow-hidden w-auto">
                      {listing.data.map((v, i) => (
                        <div
                          key={i}
                          className="w-full mb-1 cursor-pointer hover:bg-gray-500/20 "
                          onClick={() =>
                            window.open(
                              `https://opensea.io/assets/ethereum/${v.contract}/${v.tokenid}`,
                              "_blank",
                            )
                          }
                        >
                          <div className="flex items-center justify-between rounded bg-gray-500/10 h-16 p-2">
                            <div className="flex justify-center">
                              <ImgToken
                                metadata={collections.data[0].metadata}
                                tokenid={v.tokenid}
                                contract={name}
                              />
                              <div className="ml-2 flex items-center">
                                <div className="flex items-center">
                                  <p className="font-normal text-sm text-white">
                                    Token:{" "}
                                    <span className="text-base text-gray-300 font-bold">
                                      {v.tokenid}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  <img
                                    style={{
                                      height: "11px",
                                      paddingRight: "3px",
                                    }}
                                    src={eth}
                                    alt="eth"
                                  />
                                  <p className="font-medium text-sm text-white">
                                    {ethers.utils.formatEther(`${v.price}`)}
                                  </p>
                                  <img
                                    src={opensea_dark}
                                    style={{
                                      height: "19px",
                                      paddingLeft: "8px",
                                    }}
                                    alt="opensea_dark"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                {moment.unix(v.listing_time).fromNow()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-col">
                <div className="flex flex-row flex-wrap justify-between">
                  <div className="h-12 m-2">
                    <div className="flex-col flex">
                      <span className="uppercase font-semibold text-sm">
                        listings
                      </span>
                      <p className="text-xs text-gray-500 flex">
                        Feed is loading
                        <span className="h-2 w-2 ml-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500 ">
                            <span className="animate-ping inline-flex h-full w-full rounded-full bg-gray-300 opacity-75"></span>
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-[600px] ">
                  <div className="overflow-auto will-change-transform h-full scrollbar-hide">
                    <div className="overflow-hidden w-auto">
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className="basis-1/4 flex-grow-0 p-2 border border-gray-500 rounded-xl m-2">
            {sold.isSuccess === true ? (
              <div className="flex-col">
                <div className="flex flex-row flex-wrap justify-between">
                  <div className="h-12 m-2">
                    <div className="flex-col flex">
                      <span className="uppercase font-semibold text-sm">
                        Trades
                      </span>
                      <p className="text-xs text-[#0FFF50] flex normal-case">
                        Feed is live
                        <span className="h-2 w-2 ml-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FFF50] ">
                            <span className="animate-ping inline-flex h-full w-full rounded-full bg-[#0FFF50] opacity-75"></span>
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-[600px] ">
                  <div className="overflow-auto will-change-transform h-full scrollbar-hide">
                    <div className="overflow-hidden w-auto">
                      {sold.data.map((v, i) => (
                        <div
                          key={i}
                          className="w-full mb-1 cursor-pointer hover:bg-gray-500/20 "
                          onClick={() => window.open(v.permalink, "_blank")}
                        >
                          <div className="flex items-center justify-between rounded bg-gray-500/10 h-16 p-2">
                            <div className="flex justify-center">
                              <img
                                className="object-contain rounded block"
                                style={{
                                  height: "48px",
                                  aspectRatio: "auto 48 / 48",
                                  width: "48px",
                                }}
                                src={`${v.image_url}`}
                                alt={v.token_name}
                              />
                              <div className="ml-2 flex items-center">
                                <div className="flex items-center">
                                  <p className="font-normal text-sm text-white">
                                    {v.token_name}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  <img
                                    style={{
                                      height: "11px",
                                      paddingRight: "3px",
                                    }}
                                    src={v.token_price === "ETH" ? eth : weth}
                                    alt={
                                      v.token_price === "ETH" ? "ETH" : "WETH"
                                    }
                                  />
                                  <p className="font-medium text-sm ml-1 text-white">
                                    {ethers.utils.formatEther(
                                      `${v.sale_price}`,
                                    )}
                                  </p>
                                  <img
                                    src={opensea_dark}
                                    style={{
                                      height: "19px",
                                      paddingLeft: "8px",
                                    }}
                                    alt="opensea_dark"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                {moment(`${v.closing_date}`).fromNow()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-col">
                <div className="flex flex-row flex-wrap justify-between">
                  <div className="h-12 m-2">
                    <div className="flex-col flex">
                      <span className="uppercase font-semibold text-sm">
                        Trades
                      </span>
                      <p className="text-xs text-gray-500 flex normal-case">
                        Feed is loading
                        <span className="h-2 w-2 ml-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500 ">
                            <span className="animate-ping inline-flex h-full w-full rounded-full bg-gray-300 opacity-75"></span>
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="h-[600px] ">
                  <div className="overflow-auto will-change-transform h-full scrollbar-hide">
                    <div className="overflow-hidden w-auto">
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                      <div className="w-full mb-1 ">
                        <div className="flex items-center justify-between rounded bg-gray-500/30 h-16 p-2 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div> */}
          {/* <div className="basis-1/2 border border-gray-500 rounded-xl m-2 p-2">
            <div className="m-5">
              <span className="uppercase flex items-center">
                Trades
                {sold.data !== undefined ? (
                  <p className="text-xs text-[#0FFF50] flex ml-1 lowercase">
                    is live
                    <span className="h-2 w-2 ml-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0FFF50] ">
                        <span className="animate-ping inline-flex h-full w-full rounded-full bg-[#0FFF50] opacity-75"></span>
                      </span>
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 flex ml-1 lowercase">
                    is loading
                    <span className="h-2 w-2 ml-2">
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-500 ">
                        <span className="animate-ping inline-flex h-full w-full rounded-full bg-gray-300 opacity-75"></span>
                      </span>
                    </span>
                  </p>
                )}
              </span>
            </div>
            <div className="items-center justify-end w-full flex">
              <span className="text-white/40 text-sm mr-2">Span:</span>
              <div className="relative inline-block">
                <label
                  className="items-center mr-5 inline-flex w-20 h-8 justify-center rounded-lg border border-gray-500 bg-transparent px-4 py-2 text-sm font-medium text-gray-400 shadow-sm cursor-pointer hover:border-white/70"
                  id="menu-button"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => setOpen(!isOpen)}
                >
                  {filter}
                  <Hamburger toggled={isOpen} toggle={setOpen} size={16} />
                </label>
                {isOpen ? (
                  <div className="absolute z-10 mr-5 mt-2 w-20 origin-top-right divide-y divide-gray-100 rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="none">
                      {option_select.map((v, i) => (
                        <span
                          key={i}
                          className="text-white block px-4 py-2 text-xs cursor-pointer hover:bg-gray-500/50"
                          role="menuitem"
                          id="menu-item-0"
                          onClick={() => {
                            setFilter(v.value);
                            setOpen(!isOpen);
                          }}
                        >
                          {v.label}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <span className="text-white/40 text-sm mr-2 ">Outlier:</span>
              <div>
                <label className="switch mr-5">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isOutlier}
                    onChange={() => setOutlier(!isOutlier)}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            <Lines filter={filter} collection={name} outlier={isOutlier} />
          </div> */}
        </div>
        {/* <div className="flex flex-row mt-2">
          <div className="basis-[49.9%] border border-gray-500 rounded-xl m-2 p-2">
            <div className="">
              <Bars collection={name} />
            </div>
          </div>
        </div> */}
      </div>
      <MetaTag
        name={
          collections.isSuccess === true
            ? collections.data[0].collection_name
            : name
        }
      />
      <ToastContainer delay={1e3 * 30} position="bottom-right" />
    </div>
  );
}

export default Collection;
