import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';
import Weather from './components/weather';
import WeatherDetailsScreen from './components/weatherDetails';

export type RootStackParamList = {
  Home: undefined;
  Weather: undefined;
  WeatherDeets: { currentWeather: Object; };
};

type Props = NativeStackScreenProps<RootStackParamList>;

function HomeScreen({ navigation } : Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Get Current Weather Conditions"
        onPress={() => {
          navigation.navigate('Weather');
        }}
      />
    </View>
  );
}

export default class App extends React.Component {
  render() {
    const  Stack = createNativeStackNavigator<RootStackParamList>();
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Weather" component={Weather} />
          <Stack.Screen name="WeatherDeets" component={WeatherDetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}