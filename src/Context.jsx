import { createContext, useEffect, useMemo, useState } from "react";
import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";
export const PeerContext = createContext({});

export const PeerProvider = (props) => {
  const [data, setData] = useState({});

  return (
    <PeerContext.Provider value={{ data, setData }}>
      {props.children}
    </PeerContext.Provider>
  );
};
