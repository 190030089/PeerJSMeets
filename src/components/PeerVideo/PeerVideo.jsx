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
import { CallMessages, audioIcon, audioIconSelected, endCallIcon, screenshare, videoIcon, videoIconSelected} from "../../constants";
import Modal from "../../Modal";

export default function Peervideo(props) {
  const [peerId, setPeerId] = useState(null);
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const currentStream = useRef(null);
  const [callState, setCallState] = useState({ callStatus: true, msg: CallMessages.callConnectionError })



  const incommingVideo = useRef(null);
  const outgoingVideoRef = useRef(null);
  const outgoingMainVideoRef = useRef(null);

  const valueRef = useRef("");

  const currentPeer = useRef(null);


  const callRef = useRef(null);

  const socket = io("https://dtt-meets-backend.adaptable.app/", {
    transports: ["websocket", "polling"],
  });

  const context = useContext(PeerContext);

  const meetId = context?.data?.meetId;

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
        currentStream.current=stream
        outgoingVideoRef.current.srcObject = stream;
        outgoingMainVideoRef.current.srcObject = stream;
      });
    } else {
      console.log(currentStream?.current?.getTracks())
      currentStream?.current?.getVideoTracks()[0]?.stop()
      outgoingVideoRef.current.srcObject = null;
      outgoingMainVideoRef.current.srcObject = null;
    }
    if(!mediaState?.video){
      currentStream?.current?.getVideoTracks()[0]?.stop()
    }
  }, [mediaState]);
  useEffect(()=>{
    if(!mediaState?.audio){
      console.log("Je ")
      currentStream?.current?.getAudioTracks()[0]?.stop();
    }
  },[mediaState?.audio])

  useEffect(() => {
    let peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
      console.log("peerId : ",id)
      if (meetId != undefined) {
        socket.emit("join", { roomid: meetId, peerid: id });
      }

      socket.on("userJoined", (peeId) => {
        console.log("userJoined ",peeId)
        if (peeId.data != undefined && peeId.data != id && peeId.result < 3) {
          var getUserMedia =
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia;
          let call = undefined;
          getUserMedia({ video: true, audio: true }, (mediaStream) => {
            currentStream.current=mediaStream
            call = currentPeer.current.call(peeId.data, mediaStream);
            callRef.current = call;
            setRemotePeerIdValue(call.peer);
            valueRef.current = call.peer;
            call.on("stream", (remoteStream) => {
              incommingVideo.current.srcObject = remoteStream;
            });
            call.on('close', () => {
              console.log('disconneccted  ')

              setCallState({ ...callState, callStatus: false, msg: CallMessages.disconnectedMsg })
            })
            const senders = call.peerConnection.getSenders();
            if (!mediaState.audio) {
              senders?.[0]?.replaceTrack(undefined);
            }
            if (!mediaState.video) {
              senders?.[1]?.replaceTrack(undefined);
            }
          });
        }
      });
    });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      callRef.current = call;
      getUserMedia(
        {
          audio: true,
          video: true,
        },
        (mediaStream) => {
          currentStream.current=mediaStream
          call.answer(mediaStream);
          const senders = call.peerConnection.getSenders();
          if (!mediaState.audio) {
            senders?.[0]?.replaceTrack(undefined);
          }
          if (!mediaState.video) {
            senders?.[1]?.replaceTrack(undefined);
          }
        }
      );
      setRemotePeerIdValue(call.peer);
      valueRef.current = call.peer;
      call.on("stream", (remoteStream) => {
        incommingVideo.current.srcObject = remoteStream;
      });

      call.on('close', () => {
        console.log('disconneccted  ')

        setCallState({ ...callState, callStatus: false, msg: CallMessages.disconnectedMsg })
      })
    });



    currentPeer.current = peer;
  }, []);

  // useEffect(()=>{
  //   if(!mediaState?.video){
  //     currentStream?.current?.getTracks()[1].stop()
  //   }
  // },[mediaState.video])

  useEffect(() => {
    if (callRef.current) {
      console.log("HELLODS")
      let callSate = callRef.current;
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      if (mediaState.audio || mediaState.video) {
        getUserMedia(mediaState, (stream) => {
          const senders = callSate.peerConnection.getSenders();
          senders?.[0]?.replaceTrack(stream?.getAudioTracks()[0]);
          senders?.[1]?.replaceTrack(stream?.getVideoTracks()[0]);
        });
      } else {
        const senders = callSate.peerConnection.getSenders();
        senders?.[0]?.replaceTrack(undefined);
        senders?.[1]?.replaceTrack(undefined);

      }
      if(mediaState?.screenshare){
        navigator.mediaDevices.getDisplayMedia().then((stream)=>{
          const senders = callSate.peerConnection.getSenders();
          senders?.[1]?.replaceTrack(stream?.getVideoTracks()[0]);
        }).catch((err)=>{console.log(err)})
      }
      else if(!mediaState?.screenshare && mediaState?.video){
        getUserMedia(mediaState, (stream) => {
          const senders = callSate.peerConnection.getSenders();
          senders?.[0]?.replaceTrack(stream?.getAudioTracks()[0]);
          senders?.[1]?.replaceTrack(stream?.getVideoTracks()[0]);
        });
      }
    }
  }, [mediaState]);

  const disconnectCall = () => {
    if (callRef?.current) {
      callRef.current.close();
      
      
    }
    setCallState({ ...callState, callStatus: false, msg: CallMessages.disconnectedMsg })

  }

  const hasRemote = () => {
    console.log(valueRef?.current?.length," ggg")
    return valueRef.current?.length > 0;
  };

  const hasVideo = (ref) => {
    return true;
  };

  return (
    <>
      <div
        className={`${styles.MainContainer} flex flex-column justify-center flex-items-center pad-t-sm pad-md bg-gray-300`}
      >
        <div
          id="incoming"
          className={` ${!hasRemote() ? styles.hidden : `${styles.MainVideo} `
            } radius-lg overflow-hidden border border-cobalt-600 bg-white`}
        >
          {hasVideo(incommingVideo) ? (
            <div>
              <div style={{position:'absolute'}} className="pad-md color-cobalt-600">{window.location.href.includes('user=agent')?'User View':'Agent View'  }</div>
            <video
            playsInline
              height={"100%"}
              width={"100%"}
              autoPlay
              className="box-shadow4"
              ref={incommingVideo}
            ></video></div>
          ) : (
            <div>No Cam</div>
          )}
        </div>
        <div
          id="outgoingMain"
          className={` ${hasRemote() ? styles.hidden : styles.MainVideo
            } radius-lg overflow-hidden border border-cobalt-600 bg-white`}
        >
          <div style={{position:'absolute'}} className="pad-md color-white"></div>
          <video
          playsInline
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
              !hasRemote() || !callState?.callStatus ? styles.hidden : styles.outgoing
            } mar-sm radius-lg overflow-hidden border border-cobalt-600 bg-white`}
          >
            <div style={{position:'absolute'}} className="pad-xs type-sm color-white"> </div>
            <video
            playsInline
              height={"100%"}
              width={"100%"}
              muted
              autoPlay
              className="box-shadow4"
              ref={outgoingVideoRef}
            ></video>
          </div>
        </div>
        {
          callState?.callStatus &&
          <div
            className={` ${styles.controls} width-full flex justify-center pad-t-sm absolute z5`}
          >
            {
true&& <IconButton
              icon = {screenshare}
              iconSeleted={screenshare}
              default={mediaState.screenshare}
              className={`mar-r-md ${styles.controlsButton}`}
              onSelected={(screenshare) => {
                setMediaState({ ...mediaState, screenshare: !screenshare });
              }}
            ></IconButton>
            }
           
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
              className={`mar-r-md ${styles.controlsButton}`}
              onSelected={(videoState) => {
                setMediaState({ ...mediaState, video: videoState });
              }}
            ></IconButton>
            <IconButton
              icon={endCallIcon}
              className={""}
              iconSeleted={endCallIcon}
              onSelected={() => { disconnectCall() }}
            >
            </IconButton>
          </div>
        }
      </div>
      {!callState.callStatus &&
       
        <div>
          <Modal setIsOpen={(e)=>{props.setStart(e)}}> <div className="mar-t-xs">{callState.msg}</div></Modal>
        </div> 
       }
    </>
  );
}
