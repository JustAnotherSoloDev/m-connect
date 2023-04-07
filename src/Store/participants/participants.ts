import { DataConnection, MediaConnection } from "peerjs";
import { useSyncExternalStore } from "react";
import { createStore } from "../CreateStore";

const SessionStates = ["NOT_CONECTED", "CONNECTED", "WAITING"] as const
export type SessionState = typeof SessionStates[number];
export type Participant = {
    id: string,
    dataConnection?: DataConnection,
    mediaStream?: MediaStream,
    mediaSessionState: SessionState
}

let participantsState: { participants: Participant[], mediaSessionMap: { [key: string]: MediaStream | undefined } } = {
    participants: [],
    mediaSessionMap: {}
}

const participantStore = createStore(participantsState, {
    addParticipents(state, payload: Participant) {
        if (!payload) {
            return state;
        }
        const newParticipant = payload;
        const newState = { ...state };
        const isParticipentPresent = newState.participants.find((x) => x.id === newParticipant.id)
        if (isParticipentPresent) {
            console.log(`participant ${payload.id} already present`)
            return state;
        }
        newState.participants = [...newState.participants, newParticipant]
        newState.mediaSessionMap[newParticipant.id] = newParticipant.mediaStream;
        return newState
    },
    updateParticipant(state, payload: Participant) {
        if (!payload) {
            return state;
        }
        const participantIndex = state.participants.findIndex(x => x.id === payload?.id);
        if (participantIndex < 0) {
            return state
        }
        const newstate = { ...state };
        newstate.participants[participantIndex] = { ...newstate.participants[participantIndex], ...payload }
        newstate.mediaSessionMap[payload.id] = payload.mediaStream;
        return newstate
    },
    addStream(state, payload: Participant) {
        if (!payload) {
            return state;
        }
        const participantIndex = state.participants.findIndex(x => x.id === payload?.id);
        if (participantIndex < 0) {
            return state
        }
        const newState = { ...state };
        const participant = newState.participants[participantIndex];
        console.log("stream added to ", participant.id)
        participant.mediaStream = payload.mediaStream;
        participant.mediaSessionState = "CONNECTED";
        newState.participants[participantIndex] = { ...participant };
        newState.mediaSessionMap[payload.id] = payload.mediaStream;
        return newState
    },
    addDataConnection(state, payload) {
        if (!payload && payload?.dataConnection) {
            return state;
        }
        const dataConnection = payload.dataConnection as DataConnection;
        const participantIndex = state.participants.findIndex(x => x.id === payload?.id);
        if (participantIndex < 0) {
            return state
        }
        const newState = { ...state };
        newState.participants[participantIndex].dataConnection = dataConnection;
        return newState;
    }
})
export const useParticipantsStore = () => {
    return useSyncExternalStore(participantStore.subscribe, participantStore.getSnapshot);
}

export const useParticipantsStoreActions = () => {
    return participantStore.actions
}

export const getMediaSessionForId = (id: string) => {
    return participantStore.getSnapshot().mediaSessionMap[id];
}


export const getParticipants = () => {
    return participantStore.getSnapshot().participants
}

if (document) {
    (document as any)["getStore"] = getParticipants
}