import { useSyncExternalStore } from "react";
import { createStore } from "../CreateStore";

const user: UserDetails = { id: "" };
type UserDetails = {
  id: string;
};

const store = createStore(user, {
  setUser: (state, action: UserDetails) => {
    return { ...action };
  },
});

export const useUserStore = () => {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
};

export const useUserActions = () => {
  return store.actions;
};
