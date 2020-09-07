import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import Colors from '../constants/Colors';
import * as Styles from '../constants/Styles'
export interface Props {
  label?: React.ReactNode;
  onPress: any;
  disabled?: boolean;
  color?: string
  backgroundColor?: string
}

export default function Btn(props:Props) {
    if(props.disabled === true){
      return (
        <Styles.Button disabled={props.disabled} onPress={null}>
            <Styles.BigText fontSize={20} color={props.color || Colors.lightMono}>{props.label}</Styles.BigText>
        </Styles.Button>
      ); 
    }else{
      return (
        <Styles.Button disabled={props.disabled} backgroundColor={props.backgroundColor} onPress={props.onPress}>
            <Styles.BigText fontSize={20} color={props.color || Colors.offWhite} >{props.label}</Styles.BigText>
        </Styles.Button>
      ); 
    }
    
}

  