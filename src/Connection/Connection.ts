import PeerConnction from "peerjs";
import {
  getParticipants,
  useParticipantsStoreActions,
} from "../Store/participants/participants";
import { useUserActions } from "../Store/user/user";
export const peer = new PeerConnction();

if (document) {
  (document as any)["peerObj"] = peer;
}

const userActions = useUserActions();

const participentsActions = useParticipantsStoreActions();

export const join = (id: string) => {
  return peer.connect(id);
};

export const initializePeerConnection = () => {
  peer.on("open", (id: string) => {
    console.log(id);
    userActions.setUser({ id });
  });

  peer.on("connection", (dataConnection) => {
    console.log("data connection initiated");
    participentsActions.addDataConnection({
      id: dataConnection.peer,
      dataConnection: dataConnection,
      mediaSessionState: "CONNECTED",
    });
    dataConnection.on("data", (data) => {
      const message: any = data as any;
      if (message.type === "NEW_PEER") {
        handleNewPeer(message.id);
      }
    });
  });

  peer.on("call", (mediaConnection) => {
    getUserMediaStream((stream) => {
      mediaConnection.answer(stream);
    });
    mediaConnection.on("stream", (stream) => {
      console.log(mediaConnection.peer, stream);
      participentsActions.addStream({
        id: mediaConnection.peer,
        mediaSessionState: "CONNECTED",
        mediaStream: stream,
      });
    });
    participentsActions.addParticipents({
      id: mediaConnection.peer,
      mediaSessionState: "WAITING",
    });
    InitiateDataConnection(mediaConnection.peer);
    notifyParticipants(mediaConnection.peer);
  });
};

const handleNewPeer = (id: string) => {
  if (!id) {
    return;
  }
  console.log("new participant id received", id);
  let participantObj = getParticipants().find((x) => x.id === id);
  if (participantObj) {
    console.log("already connected to ", id);
    return;
  }
  console.log("adding participant", id);
  participentsActions.addParticipents({
    id,
    mediaSessionState: "NOT_CONECTED",
  });
  establishNewMediaConnection(id);
};

const notifyParticipants = (id: string) => {
  getParticipants().forEach((participant) => {
    if (participant.id != peer.id) {
      participant.dataConnection?.send({
        type: "NEW_PEER",
        id,
      });
    }
  });
};

const InitiateDataConnection = (peerId: string) => {
  const con = peer.connect(peerId);
  participentsActions.addDataConnection({ id: peerId, dataConnection: con });
};

export const startSessionWithPeer = (participant: string) => {
  let participantObj = getParticipants().find((x) => x.id === participant);
  if (
    participantObj &&
    participantObj.mediaSessionState !== "WAITING" &&
    participantObj.mediaSessionState !== "CONNECTED"
  ) {
    establishNewMediaConnection(participant);
  }
};

const establishNewMediaConnection = (participant: string) => {
  let media = navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  media.then((mediaStream) => {
    let mediaCon = peer.call(participant, mediaStream);
    mediaCon.on("stream", (stream) => {
      participentsActions.addStream({
        id: participant,
        mediaSessionState: "CONNECTED",
        mediaStream: stream,
      });
    });
    //add current user
    participentsActions.updateParticipant({
      id: participant,
      mediaSessionState: "WAITING",
    });
    participentsActions.addParticipents({
      id: peer.id,
      mediaSessionState: "CONNECTED",
      mediaStream: mediaCon.localStream,
    });
  });
  const dataConnection = peer.connect(participant);
  participentsActions.addDataConnection({
    id: participant,
    mediaSessionState: "WAITING",
    dataConnection,
  });
};

function getUserMediaStream(callback: (stream: MediaStream) => void) {
  let media = navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  media.then((stream) => {
    callback(stream);
    participentsActions.addParticipents({
      id: peer.id,
      mediaSessionState: "CONNECTED",
      mediaStream: stream,
    });
  });
}
