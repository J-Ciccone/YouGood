import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Picker, TouchableOpacity, ToastAndroid } from 'react-native';
import Btn from '../components/Btn';
import * as firebase from '../constants/firebaseConfig'
import { useNavigation } from '@react-navigation/native';
import * as Styles from '../constants/Styles'
import Colors from '../constants/Colors'
import GlobalState, { ContactState } from '../constants/Global';
import { ContactModel, ContactItem } from '../components/ContactModel'
import { UserModel } from './UserModel';
import { Dimensions } from "react-native";
import { sendPing } from '../utility/FBFunctions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;
type ContactProps = {
    contact: ContactModel
}

export const ContactList = ({ contact }: ContactProps) => {
    const { user } = useContext(GlobalState);
    const [selectedValue, setSelectedValue] = useState("You Good?");
    const sendAlert = async () => {
        const date = new Date();
        const ping = {
            message: selectedValue,
            response: '-1',
            time: date.getTime(),
            to: contact.displayName,
            userId: user.phoneNumber,
            username: user.displayName,
            users: [user.phoneNumber, contact.phoneNumber],
        };
        sendPing(ping, contact.pushToken).then(() => showToastWithGravity(contact.displayName))
    }

    const showToastWithGravity = (displayName: string) => {
        ToastAndroid.showWithGravity(
            "Ping Sent to "+ displayName + '!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
        );
    };
    return (
        <Styles.Div backgroundColor={Colors.lightMono}  style={styles.div}>
            <View style={{ minHeight: 70, borderColor: 'black', width: '50%' }}>
                <View style={{ flexDirection: 'column', marginRight: 0, }}>
                    <Styles.Text fontSize={20} color={Colors.offWhite}>{contact.displayName}</Styles.Text>
                    <Styles.Text color={Colors.darkMono} fontSize={15}>
                        {contact.phoneNumber}
                    </Styles.Text>
                </View>
            </View>
            <View style={{ minHeight: 70, padding: 0, margin: 0, width: '50%', borderColor: 'black' }}>

                <Styles.Button
                    style={{ paddingBottom: 5, marginBottom: 10, backgroundColor: Colors.offWhite }}
                    onPress={() => sendAlert()}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Styles.Text fontSize={15} color={Colors.darkMono}>Send Ping</Styles.Text>
                        <MaterialCommunityIcons name="arrow-top-right-thick" color={Colors.darkMono} size={25} style={{ paddingLeft: 20, marginTop: 5 }} />
                    </View>
                </Styles.Button>



                <Picker
                    selectedValue={selectedValue}
                    style={{ height: 20, width: 170 }}
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                >
                    <Picker.Item label="You Good?" value="You Good?" />
                    <Picker.Item label="Still Meeting?" value="Still Meeting?" />
                    <Picker.Item label="On My Way!" value="On My Way!" />
                    <Picker.Item label="I'm Here!" value="I'm Here!" />
                </Picker>
            </View>
        </Styles.Div>
    )
}


const offset = 24;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nameInput: { // 3. <- Add a style for the input
        height: offset * 2,
        margin: offset,
        paddingHorizontal: offset,
        borderColor: '#111111',
        borderWidth: 1,
    },
    logoutButton: {
        marginLeft: 50,
    },
    pickerItem: {
        color: 'red'
    },
    div: {
        //width: deviceWidth-20,
        width: '100%',
        padding: 5,
        borderColor: Colors.mainColor,
        borderBottomWidth: 1,
        flexDirection: 'row',
        height: 100
    }
});



export default ContactList;

