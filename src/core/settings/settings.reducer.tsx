import { Reducer } from 'react';
import { SettingsActionType } from './settings.actions';
import { ISettings, ISettingsReducerAction, ISettingsWallet, ThemeModes } from './settings.interface';

export const SettingsReducer:Reducer<ISettings, ISettingsReducerAction> = (prevState: ISettings, action: ISettingsReducerAction) => {
    console.log("reducer", action);
    switch (action.type) {
        case SettingsActionType.SET:
            return {
                ...action.value as ISettings
            } as ISettings;
        case SettingsActionType.SET_WALLET:
            return {
                wallet: action.value as ISettingsWallet,
                wallet_history: [action.value, ...prevState.wallet_history] as ISettingsWallet[]
            } as ISettings;
        case SettingsActionType.SET_THEME:
            return {
                ...prevState,
                theme: action.value as "light" | "dark"
            };
        case SettingsActionType.SET_THEME_MODE:
            return {
                ...prevState,
                theme_mode: action.value as ThemeModes
            };
        case SettingsActionType.RESET_HISTORY:
            return {
                ...prevState,
                wallet_history: []
            } as ISettings;
    }
    return prevState;
};