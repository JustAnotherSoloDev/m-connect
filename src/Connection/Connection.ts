import PeerConnection from "peerjs";
import {
  getParticipants,
  useParticipantsStoreActions,
} from "../Store/participants/participants";
import { useUserActions } from "../Store/user/user";
export const peer = new PeerConnection();

if (document) {
  (document as any)["peerObj"] = peer;
}

const userActions = useUserActions();

const participantsActions = useParticipantsStoreActions();

export const join = (id: string) => {
  return peer.connect(id);
};

/**
 * initialize peer js
 */
export const initializePeerConnection = () => {
  //create a peer id
  peer.on("open", (id: string) => {
    console.log(id);
    userActions.setUser({ id });
  });
  /**********************add handlers for peer connections************************/
  //handle data connection
  peer.on("connection", (dataConnection) => {
    console.log("data connection initiated");
    participantsActions.addDataConnection({
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
  //handle call from another user
  peer.on("call", (mediaConnection) => {
    //get current user media
    getUserMediaStream((stream) => {
      //answer the call with the current media stream
      mediaConnection.answer(stream);
    });
    //once a stream is provided for the user update the participant's stream using a callback
    mediaConnection.on("stream", (stream) => {
      console.log(mediaConnection.peer, stream);
      participantsActions.addStream({
        id: mediaConnection.peer,
        mediaSessionState: "CONNECTED",
        mediaStream: stream,
      });
    });
    // add new user to participant list
    participantsActions.addParticipants({
      id: mediaConnection.peer,
      mediaSessionState: "WAITING",
    });
    //initiate data connection with the new user
    InitiateDataConnection(mediaConnection.peer);
    //notify existing users that a new user has joined
    notifyParticipants(mediaConnection.peer);
  });
};

/**
 * Handle connection for a new peer
 * @param id if of the new peer
 */
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
  participantsActions.addParticipants({
    id,
    mediaSessionState: "NOT_CONNECTED",
  });
  // establish media connection with new peer
  establishNewMediaConnection(id);
};

/**
 * notify all the participants that a new user has joined
 * @param id id of a new joiner
 */
const notifyParticipants = (id: string) => {
  //get list of all the participants and send the new id to them
  getParticipants().forEach((participant) => {
    if (participant.id != peer.id) {
      participant.dataConnection?.send({
        type: "NEW_PEER",
        id,
      });
    }
  });
};

/**
 * function to initiate data connection with the another user
 * @param peerId id of the user
 */
const InitiateDataConnection = (peerId: string) => {
  const con = peer.connect(peerId);
  participantsActions.addDataConnection({ id: peerId, dataConnection: con });
};

/**
 * function to start a session with another user
 * @param participant id of the participant
 */
export const startSessionWithPeer = (participant: string) => {
  //find the participant
  let participantObj = getParticipants().find((x) => x.id === participant);
  //if we are not waiting for a connection or are already connected
  if (
    participantObj &&
    participantObj.mediaSessionState !== "WAITING" &&
    participantObj.mediaSessionState !== "CONNECTED"
  ) {
    establishNewMediaConnection(participant);
  }
};
/**
 * Toggle audio for the current user
 * @param id id of the user
 */
export const toggleAudio = (id: string) => {
  //find the stream for the current user
  let participantObj = getParticipants().find((x) => x.id === id);
  //if the user stream is connected disable the track
  if (participantObj && participantObj.mediaSessionState === "CONNECTED") {
    //get the user audio track
    const audioTrack = participantObj.mediaStream?.getAudioTracks()?.[0];
    if (audioTrack) audioTrack.enabled = !audioTrack.enabled;
  }
};
/**
 * function to connect with another participant
 * @param participant id of the participant to connect with
 */
const establishNewMediaConnection = (participant: string) => {
  //get user media
  let media = navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });

  media.then((mediaStream) => {
    //start the call once the media is available
    let mediaCon = peer.call(participant, mediaStream);
    mediaCon.on("stream", (stream) => {
      participantsActions.addStream({
        id: participant,
        mediaSessionState: "CONNECTED",
        mediaStream: stream,
      });
    });
    //add the participant to the list
    participantsActions.updateParticipant({
      id: participant,
      mediaSessionState: "WAITING",
    });
    //add the current user to the participant list
    participantsActions.addParticipants({
      id: peer.id,
      mediaSessionState: "CONNECTED",
      mediaStream: mediaCon.localStream,
    });
  });
  //initiate a data connection with the user
  const dataConnection = peer.connect(participant);
  participantsActions.addDataConnection({
    id: participant,
    mediaSessionState: "WAITING",
    dataConnection,
  });
};
/**
 * Function to get the user Media Stream
 * @param callback Function that will be called with the user stream
 */
export function getUserMediaStream(callback: (stream: MediaStream) => void) {
  let media = navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  media.then((stream) => {
    callback(stream);
    participantsActions.addParticipants({
      id: peer.id,
      mediaSessionState: "CONNECTED",
      mediaStream: stream,
    });
  });
}
