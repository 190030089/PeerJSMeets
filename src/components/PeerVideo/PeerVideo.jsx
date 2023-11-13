import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { PeerContext } from "../../Context";
import styles from "./PeerVideo.module.css";

export default function Peervideo() {
  const [peerId, setPeerId] = useState(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");

  const meetId = useRef(null);

  const incommingVideo = useRef(null);
  const outgoingVideoRef = useRef(null);
  const outgoingMainVideoRef = useRef(null);

  const valueRef = useRef("");

  const currentPeer = useRef(null);

  const params = new URL(window.location.href).searchParams;

  const socket = io("https://dtt-meets-backend.adaptable.app/", {
    transports: ["websocket", "polling"],
  });

  const context = useContext(PeerContext);

  const mediaState = useMemo(() => {
    return context?.data?.mediaState;
  }, [context?.data?.mediaState]);

  useEffect(() => {
    if (mediaState?.audio || mediaState.video) {
      navigator.getUserMedia(mediaState, (stream) => {
        outgoingVideoRef.current.srcObject = stream;
        outgoingMainVideoRef.current.srcObject = stream;
      });
    }
  }, [mediaState]);

  useEffect(() => {
    let peer = new Peer();
    console.log("id params", params.get("id"));
    let meetId = params.get("id");

    peer.on("open", (id) => {
      console.log(id);
      setPeerId(id);
      if (params.get("id") != undefined) {
        socket.emit("join", { roomid: meetId, peerid: id });
      }
      socket.on("userJoined", (peeId) => {
        console.log("Heelo ", peeId, " jj ", id);
        if (peeId.data != undefined && peeId.data != id && peeId.result < 3) {
          var getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
          console.log("hello userJoined");
          getUserMedia({ video: true, audio: true }, (mediaStream) => {
            outgoingVideoRef.current.srcObject = mediaStream;
            const call = currentPeer.current.call(peeId.data, mediaStream);
            setRemotePeerIdValue(call.peer);
            valueRef.current = call.peer;
            call.on("stream", (remoteStream) => {
              incommingVideo.current.srcObject = remoteStream;
            });
          });
        }
      });
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        outgoingVideoRef.current.srcObject = mediaStream;
        call.answer(mediaStream);
        console.log("call meta data", call.metadata, " /n ", call);
        setRemotePeerIdValue(call.peer);
        valueRef.current = call.peer;
        call.on("stream", (remoteStream) => {
          incommingVideo.current.srcObject = remoteStream;
        });
      });
    });

    currentPeer.current = peer;
  }, []);

  const hasRemote = () => {
    return valueRef.current.length > 0;
  };

  return (
    <>
      <div
        className={`${styles.MainContainer} flex justify-center pad-md bg-gray-300`}
      >
        <div
          id="incoming"
          className={` ${
            !hasRemote() ? styles.hidden : styles.MainVideo
          } radius-lg overflow-hidden `}
        >
          <video
            height={"100%"}
            width={"100%"}
            muted
            autoPlay
            className="box-shadow4"
            ref={incommingVideo}
          ></video>
        </div>
        <div
          id="outgoingMain"
          className={` ${
            hasRemote() ? styles.hidden : styles.MainVideo
          } radius-lg overflow-hidden `}
        >
          <video
            height={"100%"}
            width={"100%"}
            className="box-shadow4"
            muted
            autoPlay
            ref={outgoingMainVideoRef}
          ></video>
        </div>
        <div>
          <div
            id="outgoing"
            className={`${
              !hasRemote() ? styles.hidden : styles.outgoing
            } mar-sm radius-lg overflow-hidden `}
          >
            <video
              height={"100%"}
              width={"100%"}
              muted
              autoPlay
              className="box-shadow4"
              ref={outgoingVideoRef}
            ></video>
          </div>
        </div>
      </div>
    </>
  );
}
