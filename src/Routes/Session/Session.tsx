import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { WaitingArea } from "../Waiting/Waiting";
import { startSessionWithPeer, toggleAudio } from "../../Connection/Connection";
import {
  getMediaSessionForId,
  useParticipantsStore,
  useParticipantsStoreActions,
} from "../../Store/participants/participants";
import { useUserStore } from "../../Store/user/user";
import styles from "../Session/Session.module.scss";

export const Session = () => {
  const user = useUserStore();
  const { participants } = useParticipantsStore();
  const particioantsActions = useParticipantsStoreActions();
  const [searchParams] = useSearchParams();
  const [sessionId] = useState(() => searchParams.get("sessionId"));
  useEffect(() => {
    if (sessionId && user?.id && sessionId !== user.id) {
      particioantsActions.addParticipents({
        id: sessionId,
        mediaSessionState: "NOT_CONECTED",
      });
    }
  }, [sessionId, user?.id]);

  if (!sessionId) {
    return <div>Invalid ID please enter the Join Code again</div>;
  }
  if (!user.id) {
    return <div>Please wait</div>;
  }

  if (user.id === sessionId && (participants?.length ?? 0) < 1) {
    return <WaitingArea />;
  }
  if (participants.length > 0) {
    return <SessionStart sessionId={sessionId} user={user}></SessionStart>;
  }

  return <div>Something went wrong</div>;
};

const SessionStart = ({
  sessionId,
  user,
}: {
  user: any;
  sessionId: string;
}) => {
  const { participants } = useParticipantsStore();
  const [isMuted, setIsMuted] = useState(false);
  //Attach a Listener
  useEffect(() => {
    if (user?.id && sessionId && user.id !== sessionId) {
      startSessionWithPeer(sessionId);
    }
  }, [user?.id, sessionId]);

  const container = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (container.current) {
      const { columns, rows } = getGridSize(participants.length);
      container.current.style.setProperty("--items", columns.toString());
      container.current.style.setProperty("--rows", rows.toString());
    }
  }, [participants.length]);

  const toggleAudioForCurrentUser = () => {
    toggleAudio(user?.id);
  };

  return (
    <>
      <div className={styles["container"]} ref={container}>
        {participants.map((participant) => (
          <div key={participant.id} className={styles["participant"]}>
            <Video
              id={participant.id as any}
              MediaSessionState={participant.mediaSessionState}
            />
          </div>
        ))}
      </div>
      <div className={styles["fab-container"]}>
        <div className={styles["fab"]}>
          <div className={styles["fab-icon"]}>
            <button onClick={toggleAudioForCurrentUser} disabled={isMuted}>
              Mute
            </button>
            <button onClick={toggleAudioForCurrentUser} disabled={!isMuted}>
              unMute
            </button>
          </div>
        </div>
        <div className={styles["fab"]}>
          <div className={styles["fab-icon"]}></div>
        </div>
        <div className={styles["fab"]}>
          <div className={styles["fab-icon"]}></div>
        </div>
      </div>
    </>
  );
};

const Video = ({
  id,
  MediaSessionState,
}: {
  id: any;
  MediaSessionState: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const source = getMediaSessionForId(id);
    console.log(id, source);
    if (videoRef.current && source && MediaSessionState === "CONNECTED") {
      videoRef.current.srcObject = source as any;
      videoRef.current.play();
    }
  }, [id, MediaSessionState]);
  return (
    <>
      <video ref={videoRef}></video>
      <div>{id}</div>
    </>
  );
};

function getGridSize(count: number) {
  //since we want to divide the count into a square matrix
  // we need to find n * n = count
  //finding sqrt is an o(1) operation.
  const factor = Math.sqrt(count);
  let rows = Math.floor(factor);
  let columns = Math.ceil(factor);
  const gridFactor = rows * columns;
  //check if the elements can be added to grid if not increase the row by 1
  if (gridFactor < count) {
    //since with sqrt we are relative very close to a square marix add a new row means we definatly have
    // a grid that can contain alll the elements.
    rows += 1;
  }
  return { columns, rows };
}
