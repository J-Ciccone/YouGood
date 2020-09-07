import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, FlatList, TouchableOpacity } from 'react-native';
import Btn from '../components/Btn';
import firebase from '../constants/firebaseConfig'
import { useNavigation } from '@react-navigation/native';
import * as Styles from '../constants/Styles'
import Colors from '../constants/Colors'
import GlobalState, { ContactState } from '../constants/Global';
import { ContactModel, ContactItem } from '../components/ContactModel'
import { PingModel } from '../components/PingModel'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as format from '../utility/format'
import * as FB from '../utility/FBFunctions'
import { Dimensions } from "react-native";


var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

type PingProps = {
    ping: PingModel,
    _key: any
}
/*
    message: string;
    response: string;
    time: number;
    userId: string;
    username: string;
    users: string[] */
export const PingList = ({ ping, _key }: PingProps) => {
    const { user } = useContext(GlobalState);
    const [response, setResponse] = useState('');
    const time = new Date(ping.time);
    const date = format.formatDate(time);



    if (ping.userId === user.phoneNumber) { //Pings Sent from User
        if (ping.response !== '-1') {
            if (ping.response === '0' || ping.response === '2') {
                return (
                    <View>
                        <View style={styles.responseOverlay}>
                            {ping.response === '0'
                                ? <MaterialCommunityIcons name="thumb-up-outline" color={'#56CE56'} size={50} />
                                : <MaterialCommunityIcons name="thumb-down-outline" color={'#F54545'} size={50} />
                            }

                        </View>
                        <Styles.Div backgroundColor={Colors.lightMono} style={styles.div}>
                            <View style={{ flexDirection: 'row', width: '100%', }}>
                                <Styles.Text style={{ alignSelf: 'flex-start' }} color={Colors.offWhite} fontSize={13}>
                                    {ping.to}
                                </Styles.Text>
                                <MaterialCommunityIcons name="check-underline" color={Colors.offWhite} size={20} style={{ marginLeft: 'auto' }} />
                            </View>
                            <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                                <Styles.Text fontSize={30} color={Colors.offWhite}>{ping.message}</Styles.Text>
                                <Styles.Text fontSize={10} color={Colors.offWhite}>{date}</Styles.Text>
                            </View>
                        </Styles.Div>
                    </View>
                )
            }
        }
        return ( // From User waiting for response
            <View>
                <Styles.Div backgroundColor={Colors.darkMono} style={styles.div}>
                    <View style={{ flexDirection: 'row', width: '100%', }}>
                        <Styles.Text style={{ alignSelf: 'flex-start' }} color={Colors.offWhite} fontSize={13}>
                            {ping.to}
                        </Styles.Text>
                        <MaterialCommunityIcons name="arrow-top-right-thick" color={Colors.offWhite} size={20} style={{ marginLeft: 'auto' }} />
                    </View>

                    <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                        <Styles.Text fontSize={30} color={Colors.offWhite}>{ping.message}</Styles.Text>
                        <Styles.Text fontSize={10} color={Colors.offWhite}>{date}</Styles.Text>
                    </View>

                </Styles.Div>
            </View>
        )
    } else {
        if (ping.response === '-1') {
            return ( //Ping sent to the User
                <View>
                    <Styles.Div backgroundColor={Colors.mainColor} style={styles.answeredDiv}>
                        <View style={{ alignSelf: 'center', width: '60%', flexDirection: 'column' }}>
                            <Styles.Text fontSize={30} color={Colors.offWhite}>{ping.message}</Styles.Text>
                            <Styles.Text style={{}} color={Colors.offWhite} fontSize={10}>
                                {ping.username + ' | ' + date}
                            </Styles.Text>
                            <Styles.Text style={{}} color={Colors.offWhite} fontSize={10}>
                                {ping.userId}
                            </Styles.Text>
                        </View>
                        <View style={{ marginLeft: 20, marginRight: 'auto', flexDirection: 'row' }}>
                            <Styles.Div
                                style={{ marginTop: 5, marginLeft: 'auto', marginRight: 10, backgroundColor: Colors.offWhite, justifySelf: 'center' }}
                                radius={5}
                            >
                                <TouchableOpacity onPress={() => FB.sendResponse('0', _key)}>
                                    <MaterialCommunityIcons name="thumb-up-outline" color={'#56CE56'} size={30} style={{ alignSelf: 'center' }} />
                                </TouchableOpacity>
                            </Styles.Div>
                            <Styles.Div
                                style={{ marginTop: 5, marginLeft: 'auto', marginRight: 10, addingBottom: 5, backgroundColor: Colors.offWhite, justifySelf: 'center' }}
                                radius={5}
                            >
                                <TouchableOpacity onPress={() => FB.sendResponse('2', _key)}>
                                    <MaterialCommunityIcons name="thumb-down-outline" color={'#F54545'} size={30} style={{ alignSelf: 'center' }} />
                                </TouchableOpacity>

                            </Styles.Div>
                        </View>
                    </Styles.Div>
                </View>
            )
        } else if (ping.response === '0' || '2') {
            return ( //Ping sent to the User
                <View>
                    {ping.response === '0' ?
                        <Styles.Div backgroundColor={'#56CE56'} style={styles.answeredDiv}>
                            <View style={{ alignSelf: 'center', width: '60%', flexDirection: 'column' }}>
                                <Styles.Text fontSize={30} color={Colors.offWhite}>{ping.message}</Styles.Text>
                                <Styles.Text style={{}} color={Colors.offWhite} fontSize={10}>
                                    {ping.username + ' | ' + date}
                                </Styles.Text>
                                <Styles.Text style={{}} color={Colors.offWhite} fontSize={10}>
                                    {ping.userId}
                                </Styles.Text>
                            </View>
                            <View style={{ marginLeft: 20, marginRight: 'auto' }}>
                                <Styles.Div
                                    style={{ marginTop: 5, marginLeft: 'auto', marginRight: 10, backgroundColor: Colors.offWhite, justifySelf: 'center' }}
                                    radius={5}
                                >
                                    <MaterialCommunityIcons name="thumb-up-outline" color={'#56CE56'} size={30} style={{ alignSelf: 'center' }} />
                                </Styles.Div>
                            </View>
                        </Styles.Div>
                        :
                        <Styles.Div backgroundColor={'#F54545'} style={styles.answeredDiv}>
                            <View style={{ alignSelf: 'center', width: '60%', flexDirection: 'column' }}>
                                <Styles.Text fontSize={30} color={Colors.offWhite}>{ping.message}</Styles.Text>
                                <Styles.Text style={{}} color={Colors.offWhite} fontSize={10}>
                                    {ping.username + ' | ' + date}
                                </Styles.Text>
                                <Styles.Text style={{}} color={Colors.offWhite} fontSize={10}>
                                    {ping.userId}
                                </Styles.Text>
                            </View>
                            <View style={{ marginLeft: 'auto' }}>
                                <Styles.Div
                                    style={{ marginTop: 5, marginLeft: 'auto', marginRight: 10, backgroundColor: Colors.offWhite, justifySelf: 'center' }}
                                    radius={5}
                                >
                                    <MaterialCommunityIcons name="thumb-down-outline" color={'#F54545'} size={30} style={{ alignSelf: 'center' }} />
                                </Styles.Div>
                            </View>
                        </Styles.Div>}
                </View>
            )
        }


    }

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
        minHeight: 100,
        width: deviceWidth - 2,
        padding: 5,
        marginBottom: .5,
        borderColor: 'black',
        borderBottomWidth: 1,
        flexDirection: 'column',
        borderRadius: 10,
        maxHeight: 100,

    },
    responseOverlay: {
        height: '100%',
        width: '100%',
        zIndex: 1,
        position: 'absolute',
        backgroundColor: 'rgba(52, 52, 52, 0.4)',
        minHeight: 100,
        maxHeight: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    response: {
        height: '100%',
        width: '100%',
        zIndex: 1,
        position: 'absolute',
        backgroundColor: 'rgba(52, 52, 52, 0.1)',
        minHeight: 100,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    answeredDiv: {
        //width: deviceWidth-20,
        minHeight: 100,
        maxHeight: 100,
        width: deviceWidth - 2,
        padding: 5,
        marginBottom: .5,
        borderColor: 'black',
        borderBottomWidth: 1,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'

    },
});

export default PingList;

