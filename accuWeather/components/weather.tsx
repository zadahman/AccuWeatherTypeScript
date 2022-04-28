import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_KEY } from '../utils/key';
import { weatherIcons } from '../utils/weatherIcons';
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../App';

// fetch the location key
async function fetchLocationKey(lat: number, long: number) {
  let latLongPair = lat + ',' + long;
  
  const response = await fetch( `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${latLongPair}` );

  if (!response.ok) {
    throw new Error(`An error occurred: ${response.status}`);
  }

  const jsonBlob = await response.json();

  let returnObj = {
    key: jsonBlob.Key,
    city: jsonBlob.ParentCity.LocalizedName,
    state: jsonBlob.AdministrativeArea.LocalizedName,
    country: jsonBlob.Country.LocalizedName
    };

  return await fetchWeather(returnObj);
}

// use the location key to get the weather
async function fetchWeather(returnObj: object) {
  await fetch( `http://dataservice.accuweather.com/currentconditions/v1/${Object(returnObj).key}?apikey=${API_KEY}&details=true` )
    .then(res => res.json())
    .then(json => {
      returnObj =  ({...returnObj,
        temperature: json[0].Temperature.Imperial.Value,
        weatherCondition: json[0].WeatherText,
      });
    })
    .catch(error => {
      throw new Error(error.message);
    });


  // use when accuweather is down
  /*let json = require('../testDocs/currentTest.json')[0]; 

  returnObj = ({...returnObj, 
    temperature: json.Temperature.Imperial.Value,
    weatherCondition: json.WeatherText
  });
  */

  return returnObj;
}

// function component
const Weather = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [content, setContent] = useState<object>({
    key: 0,
    temperature: 0,
    weatherCondition: "",
    city: "",
    state: "",
    country: ""
   });

  if (isLoading && error === "") {
    Geolocation.getCurrentPosition(
      async position => {
        let res = await fetchLocationKey(position.coords.latitude, position.coords.longitude);
        
        setContent(res);
        setIsLoading(false);
      },
      error => {
        setError('An error occurred. ' + error.message);
        setIsLoading(true);
      }
    );
  }

  if (error === "") {
    let weatherIconValue = (!isLoading) ? Object(content).weatherCondition.replace(/ /g, '_') : 'Default';
    
    return (
      <View style={[
        styles.container,
        { backgroundColor: Object(weatherIcons)[weatherIconValue].color }
      ]}> 
        {isLoading ?  (
          <View style={styles.container}> 
            <Text style={Object(styles).loadingText}>Fetching The Current Weather Condition</Text>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <TouchableOpacity activeOpacity={0.73} style={styles.headerContainer} onPress={() => navigation.navigate('WeatherDeets', { currentWeather: content })}>
                <MaterialCommunityIcons
                  size={72}
                  name={Object(weatherIcons)[weatherIconValue].icon}
                  color={'#fff'}
                />   
                <Text style={styles.tempText}>{Object(content).temperature}˚F</Text>
              </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.locationText}>Click on the temperature above!</Text>
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.title}>{Object(content).weatherCondition}</Text>
              <Text style={styles.locationText}>{Object(content).city}, {Object(content).state}</Text>
              <Text style={styles.locationText}>{Object(content).country}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
  else {
    return (
      <View style={styles.container}> 
        <Text style={styles.errorText}>Something went wrong</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tempText: {
    fontSize: 72,
    color: '#fff'
  },
  locationText: {
    fontSize: 20,
    color: '#fff'
  },
  bodyContainer: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: 25,
    marginBottom: 40
  },
  title: {
    fontSize: 60,
    color: '#fff'
  },
  errorText: {
    fontSize: 30,
    color: '#f0f'
  }
});

export default Weather;