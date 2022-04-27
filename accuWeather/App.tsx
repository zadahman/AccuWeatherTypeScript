
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';
import Weather from './components/weather';
import WeatherDetailsScreen from './components/weatherDetails';


type RootStackParamList = {
  Home: undefined;
  CurrentWeather: undefined;
  WeatherDeets: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList>;

function HomeScreen({ navigation } : Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Get Current Weather Conditions"
        onPress={() => {
          navigation.navigate('CurrentWeather');
        }}
      />
    </View>
  );
}

function CurrentWeatherScreen({ navigation } : Props) {
  return (
    <Weather navigate={navigation} />
  );
}

export default class App extends React.Component {
  render() {
    const  Stack = createNativeStackNavigator();
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CurrentWeather" component={CurrentWeatherScreen} />
          <Stack.Screen name="WeatherDeets" component={WeatherDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}