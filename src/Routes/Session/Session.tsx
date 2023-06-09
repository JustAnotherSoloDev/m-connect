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
import { Button, IconButton } from "../../Components/button";
import { Mic } from "../../Components/Icons/Mic/Mic";

export const Session = () => {
  const user = useUserStore();
  const { participants } = useParticipantsStore();
  const participantsActions = useParticipantsStoreActions();
  const [searchParams] = useSearchParams();
  const [sessionId] = useState(() => searchParams.get("sessionId"));
  useEffect(() => {
    if (sessionId && user?.id && sessionId !== user.id) {
      participantsActions.addParticipants({
        id: sessionId,
        mediaSessionState: "NOT_CONNECTED",
      });
    }
  }, [sessionId, user?.id]);

  if (!sessionId) {
    return <div>Invalid ID please enter the Join Code again</div>;
  }
  if (!user.id) {
    return <div>Please wait</div>;
  }

  if (user.id === sessionId && (participants?.length ?? 0) < 2) {
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
    setIsMuted((prevValue) => !prevValue);
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
            <IconButton onClick={toggleAudioForCurrentUser}>
              <Mic isDisabled={isMuted} />
            </IconButton>
          </div>
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
    //since with sqrt we are relative very close to a square matrix add a new row means we definitely have
    // a grid that can contain all the elements.
    rows += 1;
  }
  return { columns, rows };
}
