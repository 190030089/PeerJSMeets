import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  audioIcon,
  audioIconSelected,
  videoIcon,
  videoIconSelected,
} from "../../constants";
import styles from "./Home.module.css";
import { PeerContext } from "../../Context";
import { useNavigate, useParams } from "react-router-dom";

export default function Home(props) {
  const videRef = useRef(null);

  const [mediaState, setMediaState] = useState({
    video: true,
    audio: true,
  });

  const params = useParams();

  const navigate = useNavigate();

  const context = useContext(PeerContext);

  const meetId = context?.data?.meetId;

  const [idState, setIdState] = useState(meetId);

  useEffect(() => {
    setIdState(meetId);
  }, [meetId]);

  useEffect(() => {
    context?.setData({ ...context?.data, meetId: params["id"] });
  }, []);

  useEffect(() => {
    if (mediaState?.audio || mediaState.video) {
      navigator.getUserMedia(mediaState, (stream) => {
        videRef.current.srcObject = stream;
      });
    }
  }, [mediaState]);

  const onJoinMeeting = (e) => {
    const data = context?.data;
    if (idState && idState?.length > 0) {
      props?.setStart(true);
      context?.setData({
        ...data,
        mediaState,
        meetId: meetId ?? idState,
      });
      if (!params["id"]) {
        navigate(idState);
      }
    }
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
        <div className="flex flex-1 flex-column pad-r-lg">
          {(!meetId || meetId?.length < 1) && (
            <div className="pad-b-lg">
              <input
                className="textfield"
                placeholder="Enter Meeting ID"
                minLength={4}
                onChange={(e) => setIdState(e?.target?.value)}
              ></input>
            </div>
          )}
          <button
            onClick={(e) => onJoinMeeting(e)}
            className="btn-primary"
            disabled={!idState || idState?.length < 1}
          >
            <div className="text-base ">Join the meeting</div>
          </button>
        </div>
      </div>
    </>
  );
}

export const IconButton = (props) => {
  const [selected, setSelected] = useState(props?.default ?? false);

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
