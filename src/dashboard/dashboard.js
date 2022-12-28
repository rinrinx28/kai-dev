//* Import Module Systems
// import { useState } from "react";
import "./dashboard.css";
import MetaTag from "../components/metaTags";
import Navbar from "./navboard";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />
      <h1 className="text-white">Hi</h1>
      <MetaTag name="Dashboard" />
    </div>
  );
}
