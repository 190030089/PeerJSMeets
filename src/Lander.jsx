import { useState } from "react";
import Home from "./components/Home/Home";
import PeerVideo from "./components/PeerVideo/PeerVideo.jsx";
import Navbar from "./Navbar";

export default function Lander(props) {
  const [start, setStart] = useState(false);

  return (
    <div>
      <Navbar></Navbar>
      {start ? <PeerVideo /> : <Home start={start} setStart={setStart} />}
    </div>
  );
}
