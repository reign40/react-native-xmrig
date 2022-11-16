import React, { createContext, Context, useReducer, Dispatch, useEffect, useState, EffectCallback } from "react";
import { NativeModules } from "react-native";
import { getCheckpointByMin } from "../utils";
import { SettingsActionType } from "./settings.actions";
import { ISettings, ISettingsReducerAction, ThemeModes, Themes } from "./settings.interface";
import { SettingsReducer } from "./settings.reducer";
import { SettingsStorageInit, SettingsStorageSave } from "./settings.storage";
import uuid from 'react-native-uuid';
import { useInterval } from "../hooks";

const { XMRigModule } = NativeModules;


const initialState: ISettings = {
    ready: false,
    wallet: null,
    wallet_history: [],
    theme: Themes.DARK,
    theme_mode: ThemeModes.ADVANCED,
    max_threads: 2,
    total_mining: 0,
    dev_fee: 20,
    uuid: uuid.v4().toString()
};

export type SettingsStateDispatch = [state: ISettings, dispatch: Dispatch<ISettingsReducerAction>]


export const SettingsContext:Context<SettingsStateDispatch> = createContext<SettingsStateDispatch>([initialState, () => {}]);


export const SettingsContextProvider:React.FC = ({children}) =>  {
    const [state, dispatch]:SettingsStateDispatch = useReducer(SettingsReducer, initialState);
    const [asyncLoaderState, setAsyncLoaderState] = useState<boolean>(false);
    const [nativeTotalMining, setNativeTotalMining] = useState<number>(0);

    useInterval(() => {
      XMRigModule.totalMiningMinutes()
        .then((value: number) => setNativeTotalMining(value))
        .catch(() => {})
    }, 60*1000);

    useEffect(() => {
      console.log("settings effect - SettingsStorageInit");
      SettingsStorageInit(initialState)
        .then((value:ISettings) => {
          dispatch({
            type: SettingsActionType.SET,
            value: {
              ...initialState, 
              ...value,
              ready: true
            }
          })
          setAsyncLoaderState(true);
        })
        .catch((e) => console.log(e));
      
      XMRigModule.totalMiningMinutes()
        .then((value: number) => setNativeTotalMining(value))
        .catch(() => {})
    }, []);

    useEffect(() => {
      console.log("state changed", state, "asyncLoaderState: ", asyncLoaderState);
      if (asyncLoaderState) {
        SettingsStorageSave(state);
      }
    }, [state]);

    useEffect(() => {
      console.log("total_mining: ", state.total_mining, "nativeTotalMining: " + nativeTotalMining);

      const newFee = 20 - getCheckpointByMin(state.total_mining + nativeTotalMining);
      if (state.ready && state.dev_fee != newFee) {
        dispatch({
          type: SettingsActionType.SET_DEV_FEE,
          value: newFee
        })
      }
    }, [state.total_mining, nativeTotalMining])

    return (
        <SettingsContext.Provider value={[state, dispatch]}>
          {children}
        </SettingsContext.Provider>
      );
}