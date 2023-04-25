import { DataConnection, MediaConnection } from "peerjs";
import { useSyncExternalStore } from "react";
import { createStore } from "../CreateStore";

const SessionStates = ["NOT_CONNECTED", "CONNECTED", "WAITING"] as const;
export type SessionState = (typeof SessionStates)[number];
export type Participant = {
  id: string;
  dataConnection?: DataConnection;
  mediaStream?: MediaStream;
  mediaSessionState: SessionState;
};

let participantsState: {
  participants: Participant[];
  mediaSessionMap: { [key: string]: MediaStream | undefined };
} = {
  participants: [],
  mediaSessionMap: {},
};
/**
 * create a participant store
 */
const participantStore = createStore(participantsState, {
  //action to add the participant
  addParticipants(state, payload: Participant) {
    if (!payload) {
      return state;
    }
    const newParticipant = payload;
    const newState = { ...state };
    //check if the participant is already present
    const isParticipantPresent = newState.participants.find(
      (x) => x.id === newParticipant.id
    );
    //if participant is already present return current state
    if (isParticipantPresent) {
      console.log(`participant ${payload.id} already present`);
      return state;
    }
    // add the new participant to the list
    newState.participants = [...newState.participants, newParticipant];
    newState.mediaSessionMap[newParticipant.id] = newParticipant.mediaStream;
    return newState;
  },
  //action to update the participant state
  updateParticipant(state, payload: Participant) {
    if (!payload) {
      return state;
    }
    //get the participant using id
    const participantIndex = state.participants.findIndex(
      (x) => x.id === payload?.id
    );
    //if participant is not present do not modify state
    if (participantIndex < 0) {
      return state;
    }
    //update the participant with new details
    const newState = { ...state };
    newState.participants[participantIndex] = {
      ...newState.participants[participantIndex],
      ...payload,
    };
    newState.mediaSessionMap[payload.id] = payload.mediaStream;
    return newState;
  },
  //add stream to the participant
  addStream(state, payload: Participant) {
    if (!payload) {
      return state;
    }
    //get the participant
    const participantIndex = state.participants.findIndex(
      (x) => x.id === payload?.id
    );
    //return early if participant not found
    if (participantIndex < 0) {
      return state;
    }
    // add stream to the existing user obj
    const newState = { ...state };
    const participant = newState.participants[participantIndex];
    console.log("stream added to ", participant.id);
    participant.mediaStream = payload.mediaStream;
    participant.mediaSessionState = "CONNECTED";
    newState.participants[participantIndex] = { ...participant };
    newState.mediaSessionMap[payload.id] = payload.mediaStream;
    return newState;
  },
  //add data connection for the participant
  addDataConnection(state, payload) {
    if (!payload && payload?.dataConnection) {
      return state;
    }
    const dataConnection = payload.dataConnection as DataConnection;
    const participantIndex = state.participants.findIndex(
      (x) => x.id === payload?.id
    );
    if (participantIndex < 0) {
      return state;
    }
    const newState = { ...state };
    newState.participants[participantIndex].dataConnection = dataConnection;
    return newState;
  },
});

export const useParticipantsStore = () => {
  return useSyncExternalStore(
    participantStore.subscribe,
    participantStore.getSnapshot
  );
};

export const useParticipantsStoreActions = () => {
  return participantStore.actions;
};

export const getMediaSessionForId = (id: string) => {
  return participantStore.getSnapshot().mediaSessionMap[id];
};

export const getParticipants = () => {
  return participantStore.getSnapshot().participants;
};

if (document) {
  (document as any)["getStore"] = getParticipants;
}
