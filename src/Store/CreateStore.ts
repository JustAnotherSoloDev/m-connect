


//Type to extract the action from the reducer
//this will extract the 2nd argument and the return type
//and plop them into a new function that will be used as action
//giving actions with typesafe input and return type
type InternalActionType<T extends (arg1: any, arg2: any) => any> = T extends (
  arg1: any,
  arg2: infer TArgumentType
) => any
  ? TArgumentType extends string | number | object | boolean
    ? (arg: TArgumentType) => ReturnType<T>
    : () => ReturnType<T>
  : () => ReturnType<T>;
export type Payload<T> = { type: string; data: T };
/**
 * Create a store that can be plugged into useSyncExternalStore and behave like a redux store
 * @param initialState Initial state of the store
 * @param reducer Reducer that will be used to modify state and generate actions
 * @returns A store that can be plugged into react hooks
 */
export function createStore<
  TState extends {},
  TAction extends Record<
    string,
    (state: TState, payload: TArgumentType) => TState
  >,
  TArgumentType = any
>(initialState: TState, reducer: TAction) {
  if (!initialState) {
    throw "initial state must be passed";
  }

  const state = { store: initialState, listeners: [] as Function[] };
  let actions: any = {};

  for (let key in reducer) {
    actions[key] = getActionFromReducer(reducer[key]);
  }

  function getActionFromReducer(
    fn: (state: TState, payload: TArgumentType) => TState
  ) {
    return (payload: any) => {
      const newState = fn(state.store, payload);
      if (newState !== state.store) {
        state.store = newState;
        notifyChange();
      }
    };
  }

  function notifyChange() {
    state.listeners.forEach((l) => {
      l();
    });
  }

  function subscribe(listener: Function) {
    state.listeners = [...state.listeners, listener];
    return () => {
      state.listeners = state.listeners.filter((l) => l !== listener);
    };
  }

  function getSnapshot() {
    return state.store;
  }

  return {
    state,
    actions: actions as {
      [key in keyof TAction]: InternalActionType<TAction[key]>;
    },
    subscribe,
    getSnapshot,
  };
}
