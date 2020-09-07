
import React from 'react';
import { ContactModel } from '../components/ContactModel'
import { UserModel } from '../components/UserModel'
export interface GlobalState {
    signedIn: boolean;
    phoneNumber: string;
    user: UserModel;
    setUser: (value: UserModel) => void;
    setPhoneNumber: (value: string) => void;
    setSignedIn: (value: boolean) => void;
}


const user = {
    displayName: '',
    phoneNumber: '',
    pushToken: ''
}

const defaultGlobalState = {
    signedIn: false,
    setSignedIn: () => { },
    phoneNumber: '',
    setPhoneNumber: () => { },
    user: user,
    setUser: () => { },
};


const GlobalState = React.createContext<GlobalState>(defaultGlobalState);

export interface ContactState {
    contacts: any;
    contactsToFind: any;
    setContactsToFind: (value: any) => void;
    setContacts: (value: any) => void;
}


const defaultContactState = {
    contacts: [],
    contactsToFind: [],
    setContactsToFind: () => { },
    setContacts: () => { }
};

export const ContactState = React.createContext<ContactState>(defaultContactState);

export interface NotificationState {
    expoPushToken: string;
    setPushToken: (value: any) => void;
}


const defaultNotificationState = {
    expoPushToken: '',
    setPushToken: () => { },
};
export const NotificationState = React.createContext<NotificationState>(defaultNotificationState);


export default GlobalState;