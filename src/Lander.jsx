import { useContext, useEffect, useState } from "react";
import Home from "./components/Home/Home";
import PeerVideo from "./components/PeerVideo/PeerVideo.jsx";
import Navbar from "./Navbar";
import { Route, Routes } from "react-router-dom";

export default function Lander(props) {
  const [start, setStart] = useState(false);

  const Page = () =>
    start ? <PeerVideo /> : <Home start={start} setStart={setStart} />;

  return (
    <div>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Page></Page>}></Route>
        <Route path="/:id" element={<Page></Page>}></Route>
      </Routes>
    </div>
  );
}
