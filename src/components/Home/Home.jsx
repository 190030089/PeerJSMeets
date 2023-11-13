import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  audioIcon,
  audioIconSelected,
  videoIcon,
  videoIconSelected,
} from "../../constants";
import Navbar from "../../Navbar";
import styles from "./Home.module.css";
import { PeerContext } from "../../Context";

export default function Home(props) {
  const videRef = useRef(null);

  const [mediaState, setMediaState] = useState({
    video: true,
    audio: true,
  });

  const context = useContext(PeerContext);

  useEffect(() => {
    if (mediaState?.audio || mediaState.video) {
      navigator.getUserMedia(mediaState, (stream) => {
        videRef.current.srcObject = stream;
      });
    }
  }, [mediaState]);

  const onJoinMeeting = (e) => {
    props?.setStart(true);
    const data = context?.data;
    context?.setData({ ...data, mediaState });
  };

  return (
    <>
      <div className="flex flex-centered pad-t-lg">
        <div className="flex-2 flex flex-column flex-centered">
          <div
            className={`${styles.videoContainer} radius-md overflow-hidden bg-gray-600 flex flex-centered`}
          >
            {mediaState?.video ? (
              <video
                height={"100%"}
                width={"100%"}
                ref={videRef}
                muted
                autoPlay
              ></video>
            ) : (
              "Camera is Off"
            )}
          </div>
          <div className={`flex justify-between rel ${styles.iconContainer}`}>
            <IconButton
              icon={audioIcon}
              iconSeleted={audioIconSelected}
              className={"mar-r-md"}
              onSelected={(audioState) => {
                setMediaState({ ...mediaState, audio: audioState });
              }}
            ></IconButton>
            <IconButton
              icon={videoIcon}
              iconSeleted={videoIconSelected}
              className={""}
              onSelected={(videoState) => {
                setMediaState({ ...mediaState, video: videoState });
              }}
            ></IconButton>
          </div>
        </div>
        <div className="flex flex-1 flex-column flex-centered pad-r-md">
          <button onClick={(e) => onJoinMeeting(e)} className="btn-primary">
            <div className="text-base ">Join the meeting</div>
          </button>
        </div>
      </div>
    </>
  );
}

const IconButton = (props) => {
  const [selected, setSelected] = useState(false);

  const onButtonSlected = (e) => {
    const selectState = !selected;
    setSelected(selectState);
    if (props.onSelected) {
      props.onSelected(!selectState);
    }
  };

  return (
    <div
      className={`${
        styles.iconButton
      } flex flex-centered overflow-hidden border border-gray-500 
      ${props?.className ?? ""}
        ${selected ? "bg-red-600 border-none" : styles.iconButtonHover}
      `}
      onClick={(e) => onButtonSlected(e)}
    >
      {selected ? props.iconSeleted : props.icon}
    </div>
  );
};
