
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, FlatList, TouchableOpacity, Picker } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '../constants/firebaseConfig'
import * as Styles from '../constants/Styles'
import Colors from '../constants/Colors'
import GlobalState, { ContactState, NotificationState } from '../constants/Global';
import { ContactModel, ContactItem } from '../components/ContactModel'
import ContactList from '../components/ContactList'
import { sendPing } from '../utility/FBFunctions'
import LoadingScreen from './LoadingScreen';
import Keys from '../constants/Keys'
import { createIconSetFromFontello } from 'react-native-vector-icons';
import { contactPermission } from '../utility/permissions';
import { Dimensions } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Search from '../utility/Search'
import { UserModel } from '../components/UserModel';

var deviceWidth = Dimensions.get("window").width;
var deviceHeight = Dimensions.get("window").height;

export default function ContactScreen() {

  const db = firebase.firestore().collection('users');
  const [toggled, setToggled] = useState(false)
  const [userFound, setUserFound] = useState(false)
  const { contacts, setContacts } = useContext(ContactState);
  const { phoneNumber, setPhoneNumber } = useContext(GlobalState);
  const [searching, setSearching] = useState(false);
  const [loadContacts, setLoadContacts] = useState(true)
  const [screenContacts, setScreenContacts] = useState([]);
  const { user, setUser } = useContext(GlobalState);
  const [contactList, setContactList] = useState([]);
  const [foundDb, setFoundDB] = useState(null);
  const { setSignedIn } = useContext(GlobalState);
  const { expoPushToken } = useContext(NotificationState);
  const { contactsToFind, setContactsToFind } = useContext(ContactState);
  const getContacts = async () => {
    const inApp = []
    for (let contact of contacts) {
      if (contact.displayName !== undefined) {
        inApp.push(contact)
      }
    }
    setScreenContacts(inApp);

    setLoading(false)
  }

  const signOut = () => {
    try {
      firebase.auth().signOut()
      setSignedIn(false)
    } catch (err) {
      console.log(err)
    }
  }
  /*React.useEffect(() => {
    if (contactList.length === 0) {
      const inApp = []
      for (let contact of contacts) {
        if (contact.displayName !== undefined) {
          inApp.push(contact)
        }
      }
      setScreenContacts(inApp);
      setContactList(inApp);
    }

  })*/

  React.useEffect(() => {
    const foundContacts = [];

    const receivedObserver = db.doc(user.phoneNumber).collection('contacts').onSnapshot(querySnapshot => {
      const contacts = querySnapshot.docs.map(doc => {
        if (doc.data().displayName !== undefined) {
          return {
            ...doc.data()
          }
        }





      });
      for (let contact of contacts) {
        if (contact !== undefined) {
          foundContacts.push(contact);
        }
      }

      setScreenContacts(foundContacts)

      receivedObserver();
    });
    if(contactList.length === 0){
      setContactList(screenContacts);
    }
  });


  const toggle = () => {
    setToggled(!toggled)
  }


  const renderItem = (item) => {

    return <ContactList contact={item} />

  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.mainColor }}>
      <Styles.Container backgroundColor={Colors.mainColor}>
        <Styles.Header flex={1} lRadius={5} rRadius={5} backgroundColor={Colors.mainColor} style={{ flexDirection: 'row' }}>
          <Styles.BigText color={Colors.offWhite} style={{ marginRight: 'auto', marginLeft: 20 }}>Contacts</Styles.BigText>
          <Styles.Button
            style={{ width: '30%', backgroundColor: Colors.darkMono }}
            onPress={() => signOut()}
          ><Styles.BigText fontSize={15} color={Colors.offWhite} style={{ padding: 5 }}> Log Out!</Styles.BigText>
          </Styles.Button>
        </Styles.Header>
        <Styles.Footer flex={9} style={styles.footer}>
          <View>
            {toggled ?
              <><View style={styles.inputNButton}>
                <Styles.Input
                  style={styles.searchInput}
                  color={Colors.offWhite}
                  selectionColor={Colors.offWhite}
                  placeholder="Search..."
                  onChangeText={(input: string) => {
                    try {
                      setUserFound(false);
                      if (screenContacts !== null) {
                        const searchResults = Search.searchDBForNumber(input);
                        searchResults.then(results => {
                          console.log(results);
                          if (results !== undefined) {

                            setFoundDB(results);
                            setUserFound(true);
                          }
                        })

                      }
                    } catch{
                    }
                  }}
                />
                <Styles.Button style={styles.button} onPress={() => toggle()}>
                  <Text style={{ color: Colors.offWhite, fontSize: 12, textAlign: 'center', marginRight: 5 }}>Search Contacts</Text>
                </Styles.Button >
              </View>
                {userFound ?
                  <ContactList contact={foundDb} />
                  :
                  <View style={{ alignSelf: 'center', width: '100%' }}>
                    <Text style={{ color: Colors.darkMono, fontSize: 22, marginTop: 20 }}>
                      Search For A User By Phonenumber
                    </Text>
                  </View>
                }
              </>
              :
              <>
                <View style={styles.inputNButton}>
                  <Styles.Input
                    style={styles.searchInput}
                    color={Colors.offWhite}
                    selectionColor={Colors.offWhite}
                    placeholder="Search..."
                    onChangeText={(input: string) => {
                      try {

                        if (screenContacts.length > 0) {
                          const searchResults = Search.mixedSearch(screenContacts as UserModel[], input);
                          searchResults.then(results => {
                            if (input !== '' && results !== null && results !== undefined) {
                              setContactList(results)
                            } else {
                              setContactList(screenContacts)
                            }

                          })

                        } else {
                          console.log('CONTACT LIST LENGTH')
                        }
                      } catch{


                      }
                    }}
                  />
                  <Styles.Button style={styles.button} onPress={() => toggle()}>
                    <Text style={{ color: Colors.offWhite, fontSize: 12, textAlign: 'center', marginRight: 5 }}>Search All Users</Text>
                  </Styles.Button >
                </View>
                {contactList === null ?
                  <View style={{ alignSelf: 'flex-start' }}>
                    <Text style={{ color: Colors.offWhite, fontSize: 20, marginTop: 20 }}>
                      Your Contacts Will Show Up Here!
                    </Text>
                  </View>
                  :
                  <FlatList
                    data={contactList}
                    renderItem={({ item }) =>
                      renderItem(item)
                    }
                    keyExtractor={(item: object, index: number) => 'key: ' + index}
                    style={{ padding: 0, marginBottom: 42, backgroundColor: Colors.offWhite }}
                  />
                }
              </>
            }
          </View>
        </Styles.Footer >
      </Styles.Container >
    </SafeAreaView>
  );

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: { // 3. <- Add a style for the input
    padding: 0,
    marginLeft: 'auto',
    borderRadius: 50,
    borderTopRightRadius: 0,
    width: '78%',
    borderBottomRightRadius: 0,
    height: 50,

  },
  logoutButton: {
    marginLeft: 50,
  },
  pickerItem: {
    color: 'red'
  },
  div: {
    //width: deviceWidth-20,
    width: deviceWidth,
    padding: 5,
    marginBottom: 5,
    borderColor: 'black',
    borderBottomWidth: 1,
    flexDirection: 'row'
  },
  footer: {
    borderWidth: 1,
    borderColor: Colors.darkMono,
    backgroundColor: Colors.offWhite,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    justifyContent: 'flex-start'
  },
  button: {
    width: '18%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderRadius: 0,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    backgroundColor: Colors.mainColor,
    padding: 0,
    height: 50,
    marginRight: 'auto'
  },
  inputNButton: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
  }
});
