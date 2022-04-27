import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, View, Text, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_KEY } from '../utils/key';
import { weatherIcons } from '../utils/weatherIcons';
import Geolocation from 'react-native-geolocation-service';





// fetch the location key
async function fetchLocationKey(lat, long) {
  let latLongPair = lat + ',' + long;
  
  const response = await fetch( `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${API_KEY}&q=${latLongPair}` );

  if (!response.ok) {
    throw new Error(`An error occurred: ${response.status}`);
  }

  const jsonBlob = await response.json();

  returnObj = {
    key: jsonBlob.Key,
    city: jsonBlob.ParentCity.LocalizedName,
    state: jsonBlob.AdministrativeArea.LocalizedName,
    country: jsonBlob.Country.LocalizedName
    };

  return await fetchWeather(returnObj);
}

// use the location key to get the weather
async function fetchWeather(returnObj) {
  await fetch( `http://dataservice.accuweather.com/currentconditions/v1/${returnObj.key}?apikey=${API_KEY}&details=true` )
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
  /*let json = require('../currentTest.json')[0]; 

  returnObj = ({...returnObj, 
    temperature: json.Temperature.Imperial.Value,
    weatherCondition: json.WeatherText
  });
  */

  return returnObj;
}

// function component
const Weather = ({navigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState({eachContent: {
    key: 0,
    temperature: 0,
    weatherCondition: null,
    city: null,
    state: null,
    country: null
   }
  });

  if (isLoading && error === null) {
    Geolocation.getCurrentPosition(
      async position => {
        let res = await fetchLocationKey(position.coords.latitude, position.coords.longitude);
        
        setContent({...content, eachContent: res});
        setIsLoading(false);
      },
      error => {
        setError('An error occurred. ' + error.message);
        setIsLoading(true);
      }
    );
  }

  if (error == null) {
    let weatherIconValue = (!isLoading) ? content.eachContent.weatherCondition.replace(/ /g, '_') : 'Default';
    
    return (
      <View style={[
        styles.container,
        { backgroundColor: weatherIcons[weatherIconValue].color }
      ]}> 
        {isLoading ?  (
          <View style={styles.container}> 
            <Text style={styles.loadingText}>Fetching The Current Weather Condition</Text>
            <ActivityIndicator />
          </View>
        ) : (
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <MaterialCommunityIcons
                size={72}
                name={weatherIcons[weatherIconValue].icon}
                color={'#fff'}
              />   
              <Text style={styles.tempText}>{content.eachContent.temperature}˚F</Text>
            </View>
            <View>
              <Button
                title="View Weather Details"
                color={'#fff'}
                onPress={() => navigate.navigate('WeatherDeets', { currentWeather: content.eachContent })}
              />
            </View>
            <View style={styles.bodyContainer}>
              <Text style={styles.title}>{content.eachContent.weatherCondition}</Text>
              <Text style={styles.locationText}>{content.eachContent.city}, {content.eachContent.state}</Text>
              <Text style={styles.locationText}>{content.eachContent.country}</Text>
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