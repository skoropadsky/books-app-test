import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookList from '../screens/BookList';
import BookDetails from '../screens/BookDetails';
import SplashScreen from '../screens/SplashScreen';

export type RootStackParamList = {
  SplashScreen: undefined;
  BookList: undefined;
  BookDetails: { bookId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="BookList" component={BookList} />
        <Stack.Screen name="BookDetails" component={BookDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
