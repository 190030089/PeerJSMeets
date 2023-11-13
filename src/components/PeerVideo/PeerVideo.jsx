import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { PeerContext } from "../../Context";
import styles from "./PeerVideo.module.css";
import { IconButton } from "../Home/Home";
import {
  audioIcon,
  audioIconSelected,
  videoIcon,
  videoIconSelected,
} from "../../constants";

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

  const callRef = useRef(null);

  const socket = io("https://dtt-meets-backend.adaptable.app/", {
    transports: ["websocket", "polling"],
  });

  const context = useContext(PeerContext);

  const mediaState = useMemo(() => {
    return context?.data?.mediaState;
  }, [context?.data?.mediaState]);

  const setMediaState = useCallback(
    (mediaState) => context?.setData({ ...context?.data, mediaState }),
    [context?.data]
  );

  useEffect(() => {
    if (mediaState?.audio || mediaState.video) {
      navigator.getUserMedia(mediaState, (stream) => {
        outgoingVideoRef.current.srcObject = stream;
        outgoingMainVideoRef.current.srcObject = stream;
      });
    } else {
      outgoingVideoRef.current.srcObject = null;
      outgoingMainVideoRef.current.srcObject = null;
    }
  }, [mediaState]);

  useEffect(() => {
    let peer = new Peer();
    let meetId = params.get("id");

    peer.on("open", (id) => {
      setPeerId(id);

      if (params.get("id") != undefined) {
        socket.emit("join", { roomid: meetId, peerid: id });
      }

      socket.on("userJoined", (peeId) => {
        if (peeId.data != undefined && peeId.data != id && peeId.result < 3) {
          var getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
          let call = undefined;
          if (mediaState.audio || mediaState.video) {
            getUserMedia(mediaState, (mediaStream) => {
              call = currentPeer.current.call(peeId.data, mediaStream);
              callRef.current = call;
              setRemotePeerIdValue(call.peer);
              valueRef.current = call.peer;
              call.on("stream", (remoteStream) => {
                incommingVideo.current.srcObject = remoteStream;
              });
            });
          } else {
            call = currentPeer.current.call(peeId.data, new MediaStream());
            callRef.current = call;
            setRemotePeerIdValue(call.peer);
            valueRef.current = call.peer;
            call.on("stream", (remoteStream) => {
              incommingVideo.current.srcObject = remoteStream;
            });
          }
        }
      });
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      callRef.current = call;
      if (mediaState.audio || mediaState.video) {
        getUserMedia(mediaState, (mediaStream) => {
          call.answer(mediaStream);
        });
      } else {
        call.answer(new MediaStream());
      }
      setRemotePeerIdValue(call.peer);
      valueRef.current = call.peer;
      call.on("stream", (remoteStream) => {
        incommingVideo.current.srcObject = remoteStream;
      });
    });

    currentPeer.current = peer;
  }, []);

  useEffect(() => {
    if (callRef.current) {
      let callSate = callRef.current;
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      if (mediaState.audio || mediaState.video) {
        getUserMedia(mediaState, (stream) => {
          const senders = callSate.peerConnection.getSenders();
          if (senders.length == 0) {
            senders;
          }
          senders?.[0]?.replaceTrack(stream?.getAudioTracks()[0]);
          senders?.[1]?.replaceTrack(stream?.getVideoTracks()[0]);
        });
      } else {
        const senders = callSate.peerConnection.getSenders();
        senders?.[0]?.replaceTrack(undefined);
        senders?.[1]?.replaceTrack(undefined);
      }
    }
  }, [mediaState]);

  const hasRemote = () => {
    return valueRef.current.length > 0;
  };

  const hasVideo = (ref) => {
    return true;
  };

  return (
    <>
      <div
        className={`${styles.MainContainer} flex flex-column justify-center pad-md bg-gray-300`}
      >
        <div
          id="incoming"
          className={` ${
            !hasRemote() ? styles.hidden : `${styles.MainVideo} `
          } radius-lg overflow-hidden border border-cobalt-600 bg-white`}
        >
          {hasVideo(incommingVideo) ? (
            <video
              height={"100%"}
              width={"100%"}
              autoPlay
              className="box-shadow4"
              ref={incommingVideo}
            ></video>
          ) : (
            <div>No Cam</div>
          )}
        </div>
        <div
          id="outgoingMain"
          className={` ${
            hasRemote() ? styles.hidden : styles.MainVideo
          } radius-lg overflow-hidden border border-cobalt-600 bg-white`}
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
            } mar-sm radius-lg overflow-hidden border border-cobalt-600 bg-white`}
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
        <div
          className={` ${styles.controls} width-full flex justify-center pad-t-sm absolute z5`}
        >
          <IconButton
            default={!mediaState?.audio}
            icon={audioIcon}
            iconSeleted={audioIconSelected}
            className={`mar-r-md ${styles.controlsButton}`}
            onSelected={(audioState) => {
              setMediaState({ ...mediaState, audio: audioState });
            }}
          ></IconButton>
          <IconButton
            default={!mediaState?.video}
            icon={videoIcon}
            iconSeleted={videoIconSelected}
            className={`${styles.controlsButton}`}
            onSelected={(videoState) => {
              setMediaState({ ...mediaState, video: videoState });
            }}
          ></IconButton>
        </div>
      </div>
    </>
  );
}