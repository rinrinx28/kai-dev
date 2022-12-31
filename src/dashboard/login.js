import "./dashboard.css";
import { useEffect, useState } from "react";
import metamask from "../image/metamask.png";
import { ToastContainer, toast } from "react-toast";
import { PulseLoader } from "react-spinners";
import { ethers } from "ethers";
import MetaTag from "../components/metaTags";
import { useNavigate } from "react-router-dom";
import { getUser } from "../api/serverapi";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://127.0.0.1:8000");

export default function Login() {
  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
  }, []);
  //! ——————————————————[UseState]——————————————————
  const [isconnect, setIsconnect] = useState(false);
  const [isload, setIsload] = useState(false);
  const [isDisable, setDisable] = useState(false);
  const navigate = useNavigate();
  //! ——————————————————[Event]——————————————————
  const handleMetaToast = () => {
    toast.error("Please install Metamask !");
  };
  async function getConnect() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      getlogin(accounts);
    } else {
      handleMetaToast();
    }
  }

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      window.location.reload();
    } else {
      setIsconnect(false);
      setDisable(false);
    }
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  const warring = () => {
    toast.warn("Please change your wallet network to mainnet.");
  };

  if (window.ethereum) {
    // listen for account changed
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    // listten for ChainID changed
    window.ethereum.on("chainChanged", chainChangedHandler);
  }

  const getlogin = async (account) => {
    let singer = new ethers.providers.Web3Provider(window.ethereum);
    let temsinger = singer.getSigner();
    let network = await temsinger.getChainId();
    if (network !== 1) {
      return warring();
    }
    setDisable(!isDisable);
    setIsload(true);
    getUser(account[0]).then((res) => {
      if (res.message === "fail" || res.message === "error") {
        setTimeout(() => {
          setIsload(false);
          setDisable(false);
          toast.error("Connection failed");
        }, 1e3 * 5);
      } else if (res.message === "success") {
        setTimeout(() => {
          setIsconnect(true);
          setIsload(false);
          navigate("/dashboard");
        }, 1e3 * 5);
      }
    });
  };
  return (
    <div className="login">
      {isconnect === false ? (
        isload === true ? (
          <div className="flex justify-center m-auto h-screen flex-col items-center">
            <button
              className="hover:bg-sky-500/30 text-white font-bold py-2 px-10 border border-sky-500 shadow-lg shadow-sky-500/50 rounded-lg flex items-center"
              onClick={getConnect}
              disabled={isDisable}
            >
              Connecting
              <span className="px-1">
                <PulseLoader color="#fff" size={5} />
              </span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center m-auto h-screen flex-col items-center">
            <button
              className="hover:bg-sky-500/30 text-white font-bold py-2 px-10 border border-sky-500 shadow-lg shadow-sky-500/50 rounded-lg flex items-center"
              onClick={getConnect}
              disabled={isDisable}
            >
              <img src={metamask} className="h-10 p-2" alt="metamask" /> Connect
              To Dashboard
            </button>
          </div>
        )
      ) : null}
      <ToastContainer delay={1e3 * 30} position="bottom-right" />
      <MetaTag name="Login" />
    </div>
  );
}
