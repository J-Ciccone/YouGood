import React, { useContext, useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, Platform, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import firebase from '../constants/firebaseConfig'
import { useNavigation } from '@react-navigation/native';
import * as Styles from '../constants/Styles'
import Colors from '../constants/Colors'
import GlobalState, { ContactState, NotificationState } from '../constants/Global'
import * as Contacts from 'expo-contacts'
import { contactPermission } from '../utility/permissions';
import { PingModel } from '../components/PingModel'
import { PingList } from '../components/PingList'
import { FlatList } from 'react-native-gesture-handler';
import { Dimensions } from "react-native";
import Constants from 'expo-constants';
import { Notifications as _Notifications } from 'expo';
import * as FB from '../utility/FBFunctions'
import * as Permissions from 'expo-permissions';

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;



var receivedObserver: any;
var sentObserver: any;
var bgReceivedObserver: any;
var screenPings;

export default function HomeScreen() {
  var sentPingList;
  var receivedPingList;
  const [toggled, setToggled] = useState(false)
  const { contacts, setContacts } = useContext(ContactState);
  const { user, setUser } = useContext(GlobalState);
  const { phoneNumber } = useContext(GlobalState);
  const [pings, setPings] = useState([]);
  const [change, setChange] = useState('');
  const [expoPushToken, setPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  let listener: any;
  const responseListener = useRef();
  const dbReceivedPings = firebase.firestore().collection('pings')
    .where('users', 'array-contains-any', [user.phoneNumber]).orderBy('time', 'desc')

  const dbTesting = firebase.firestore().collection('testing')
    .where('user', '==', user.phoneNumber)


  const toContacts = () => {
    navigation.navigate('Contacts')
  }

  const sendPushNotification = async (expoPushToken) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Ping Received',
      body: 'And here is the body!',
      data: { data: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
  const toggle = () => {
    setToggled(!toggled)
  }

  const _handleAppStateChange = (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === "active") {
      console.log("App has come to the foreground!");
      listener = _Notifications.addListener((data) => _Notifications.dismissNotificationAsync(data.notificationId))
    } else if (appState.current.match(/active/) && nextAppState === 'inactive' || nextAppState === 'background') {
      listener.remove()
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("AppState", appState.current);
  };

  /*message: string;
    response: string;
    time: number;
    userId: string;
    username: string;
    users: string[] */
  React.useEffect(() => {

    AppState.addEventListener("change", _handleAppStateChange)
    if (appState.current === 'active') {
      listener = _Notifications.addListener((data) => _Notifications.dismissNotificationAsync(data.notificationId))
    }


    receivedObserver = dbReceivedPings.onSnapshot(querySnapshot => {
      const pings = querySnapshot.docs.map(doc => {
        const today = new Date().getHours()
        const id = doc.id;
        const current = doc.data() as PingModel 
        console.log('today is '+ today)
        
          return {
            id: doc.id,
            ...doc.data()
          }
        



      });
      console.log('PING LENGTH IS: ' + pings.length);
      setPings(pings);

    });


    return () => {
      receivedObserver();
      AppState.removeEventListener("change", _handleAppStateChange);

    }
  }, [navigation]);

  if (pings.length > 0) {
    const sent: PingModel[] = [];
    const received: PingModel[] = []
    for (let ping of pings) {
      if (ping.userId === user.phoneNumber) {
        sent.push(ping)
      } else {
        received.push(ping);
      }
    }
    sentPingList = sent.map((ping: PingModel) => <PingList _key={ping.id} ping={ping} />)
    receivedPingList = received.map((ping: PingModel) => <PingList _key={ping.id} ping={ping} />)
  }



  return (
    <SafeAreaView style={{ backgroundColor: Colors.mainColor }}>
      <Styles.Container backgroundColor={Colors.offWhite}>
        <Styles.Header flex={1} lRadius={5} rRadius={5} backgroundColor={Colors.mainColor} style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Styles.BigText color={Colors.offWhite} style={{ alignSelf: 'center' }}>Pings</Styles.BigText>

        </Styles.Header>
        <Styles.Footer flex={9}>
          <View style={{ flexDirection: 'row', width: '95%', alignItems: 'center', justifyContent: 'center', marginBottom: 'auto' }}>
            <Styles.Button style={styles.toggleButton} width={100} onPress={() => toggle()}>
              {toggled ?
                <Styles.Text color={Colors.offWhite}>Show Sent</Styles.Text>
                :
                <Styles.Text color={Colors.offWhite}>Show Received</Styles.Text>
              }

            </Styles.Button>
          </View>
          {toggled ?
            <>
              {receivedPingList?.length > 0 ?
                <FlatList
                  data={receivedPingList}
                  renderItem={({ item }) =>
                    <View>
                      {item}
                    </View>}
                  keyExtractor={(item: object, index: number) => 'key: ' + index}
                  style={{ padding: 0, marginBottom: 30, backgroundColor: Colors.offWhite }}
                />
                :
                <View style={{ marginBottom: 'auto' }}>
                  <Styles.BigText fontSize={15} >Looks Like Nobody Pinged You Yet!</Styles.BigText>
                </View>
              }
            </>
            :
            <>
              {sentPingList?.length > 0 ?
                <FlatList
                  data={sentPingList}
                  renderItem={({ item }) =>
                    <View>
                      {item}
                    </View>}
                  keyExtractor={(item: object, index: number) => 'key: ' + index}
                  style={{ padding: 0, marginBottom: 60, backgroundColor: Colors.offWhite }}
                />
                :
                <View style={{ marginBottom: 'auto' }}>
                  <Styles.BigText fontSize={15} >You have No Pings Yet!</Styles.BigText>

                  <Styles.Button
                    style={{ paddingBottom: 5, marginBottom: 10, backgroundColor: Colors.mainColor, alignSelf: 'center' }}
                    onPress={() => toContacts()}
                  ><Styles.BigText fontSize={15} color={Colors.offWhite} style={{ padding: 5 }}> Go to Contacts to send some!</Styles.BigText>
                  </Styles.Button>
                </View>
              }
            </>
          }

        </Styles.Footer >

      </Styles.Container >
    </SafeAreaView>
  );
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
  toggleButton: {
    margin: 5,
    marginBottom: 5,
    height: 40,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainColor
  }
});
