import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Picker, TouchableOpacity, ToastAndroid } from 'react-native';
import Btn from '../components/Btn';
import firebase from '../constants/firebaseConfig'
import { useNavigation } from '@react-navigation/native';
import * as Styles from '../constants/Styles'
import Colors from '../constants/Colors'
import GlobalState, { ContactState } from '../constants/Global';
import { ContactModel, ContactItem } from '../components/ContactModel'
import { UserModel } from '../components/UserModel';
import { Dimensions } from "react-native";
import { sendPing } from '../utility/FBFunctions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Format from './format'

const db = firebase.firestore().collection('users');

export const searchByUserDisplayName = (users: UserModel[], input: string) => {
    const results: UserModel[] = []
    if (input !== '') {
        if (users !== undefined) {
            for (let i = 0; i < users.length; i++) {
                if (users[i].displayName.toLowerCase().match(input.toLowerCase())) {
                    results.push(users[i])
                }
            }
        }
    }

    if (results.length > 0) {
        return results;
    } else {
        return null
    }

}
export const searchUsersForPhoneNumber = async (users: UserModel[], input: string) => {
    const results: UserModel[] = []
    const manualFormat = Format.littleFormat(input)
    console.log('input is ' + input)
    if (input !== '') {
        for (let i = 0; i < users.length; i++) {
            if (users !== undefined) {
                if (users[i].phoneNumber === (manualFormat) || users[i].phoneNumber.match(input)) {
                    console.log('Match! ' + users[i])
                    results.push(users[i])
                }
            }

        }
    }

    if (results.length > 0) {
        return results;
    } else {
        return null
    }

}

export const searchDBForNumber = async (input: string) => {
    const formattedNumber = Format.formatPhoneNumber(input);
    if (formattedNumber !== null) {
        const foundNumber = db.doc(formattedNumber).get().then(doc => {
            if (doc.exists) {
                return doc.data();
            } else {
            }
        })
        return foundNumber;
    }
}

export const mixedSearch = async (users: UserModel[], input: string) => {
    const searchDName = await searchByUserDisplayName(users, input);
    const searchNumber = await searchUsersForPhoneNumber(users, input);
    if (searchDName !== null) {
        return searchDName
    } else if (searchNumber !== null) {
        return searchNumber
    } else {
        return undefined
    }
}