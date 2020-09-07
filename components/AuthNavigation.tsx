import LoginScreen from '../screens/Signup/LoginScreen'
import RegisterScreen from '../screens/Signup/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';


const Stack = createStackNavigator();

export default function AuthNavigation(){
    return(
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          options={{ headerShown: false, title: 'Welcome' }}
          component={SplashScreen}
        />
        <Stack.Screen
          name="Login"
          options={{ headerShown: false, title: 'Login' }}
          component={LoginScreen} />
        <Stack.Screen
          name="Register"
          options={{ title: 'Sign up' }}
          component={RegisterScreen} />
      </Stack.Navigator>
      </NavigationContainer>
    )
}