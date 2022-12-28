import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import metamask from "../image/metamask.png";
// import axios from "axios";
import logo from "../image/logo2.png";
import { ToastContainer } from "react-toast";
import "./navbar.css";
import { getCollectionlist } from "../api/serverapi";
import { useQuery } from "react-query";

export default function Navbar() {
  //! ——————————————————[Start Use Module]——————————————————
  const [suggestion, setSuggestion] = useState([]);
  const [defaultAccount, setAccount] = useState(null);
  const navigate = useNavigate();
  //! ——————————————————[End Use Module]——————————————————

  //! ——————————————————[Start Event]——————————————————

  const handlerText = async (text) => {
    let matches = [];
    if (text.length > 0) {
      matches = collection.data?.filter((name) =>
        name.collection_name.toLowerCase().startsWith(text.toLowerCase()),
      );
    }
    setSuggestion(matches);
  };
  //! ——————————————————[End Event]——————————————————
  //! ——————————————————[Start Query]——————————————————

  const collection = useQuery(
    "get-collectionlist",
    () => {
      return getCollectionlist();
    },
    {
      retryOnMount: false,
      staleTime: 0,
    },
  );

  useEffect(() => {
    let mounted = true;
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((res) => hanndlerUsers(res));
    }

    const hanndlerUsers = (account) => {
      if (mounted) {
        if (account.length < 1) {
          navigate("/login");
        }
        setAccount(account[0]);
      }
    };
    return () => (mounted = false);
  }, [defaultAccount, navigate]);
  //! ——————————————————[End Query]——————————————————

  return (
    <div className="flex items-center p-2 w-[100%] justify-between">
      <a href="/dashboard" className="ml-5">
        <div className="text-white text-3xl grid grid-flow-col items-center ">
          <img src={logo} alt="logo" className="h-14 p-2 rounded-sm" />
          <p className="font-Anton px-1 font-medium neontext">Kaigan</p>
        </div>
      </a>
      <div className="text-white flex flex-grow px-14">
        <div className="relative inline-block">
          <input
            type="search"
            placeholder="Search by address, name or slug..."
            className=" text-white text-sm rounded-sm w-64 block p-2  bg-gray-800 border-gray-800 placeholder-gray-400/50 focus:outline-none"
            onChange={(e) => handlerText(e.target.value)}
          />
          {suggestion.length > 0 ? (
            <div className="absolute">
              <div className="bg-gray-800 rounded-md block">
                {suggestion &&
                  suggestion.map((sugges, i) => {
                    if (i < 10) {
                      return (
                        <div
                          key={i}
                          className="hover:bg-gray-500 hover:bg-opacity-10  flex  items-center cursor-pointer p-[8px] w-64"
                          onClick={() => {
                            navigate(`/collection/${sugges.collection_adr}`);
                          }}
                        >
                          <img
                            alt={`${sugges.collection_name}`}
                            src={sugges.profile}
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                            }}
                          />
                          <div className="px-[8px] ">
                            <h6 className="font-normal text-sm">
                              {sugges.collection_name}
                            </h6>
                            <span className="text-gray-600 text-xs font-medium">
                              {sugges.collection_adr.slice(0, 6 - 1) +
                                "..." +
                                sugges.collection_adr.slice(
                                  sugges.collection_adr.length - 6,
                                  sugges.collection_adr.length,
                                )}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="text-[#4666FF] justify-end">
        <button
          className="grid grid-flow-col items-center mr-5 ring-2 ring-[#4666FF]/70 hover:ring-[#4666FF] transition duration-300 rounded-lg px-10"
          onClick={() => (defaultAccount !== null ? null : navigate("/login"))}
        >
          <img src={metamask} className="h-10 p-2" alt="metamask" />
          {defaultAccount !== null
            ? defaultAccount.slice(0, 6 - 1) +
              "..." +
              defaultAccount.slice(
                defaultAccount.length - 6,
                defaultAccount.length,
              )
            : "Connect To Dashboard"}
        </button>
      </div>
      <ToastContainer delay={1e3 * 30} position="top-center" />
    </div>
  );
}
