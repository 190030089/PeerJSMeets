import { createContext, useEffect, useMemo, useState } from "react";
import Peer from "peerjs";
export const PeerContext = createContext({});

export const PeerProvider = (props) => {
  const [data, setData] = useState({
    meetId: undefined,
    start: false,
  });

  return (
    <PeerContext.Provider value={{ data, setData }}>
      {props.children}
    </PeerContext.Provider>
  );
};
