import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_KEY } from '../utils/key';
import { weatherIcons } from '../utils/weatherIcons';
import Moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Geolocation from 'react-native-geolocation-service';

// use the location key to get the weather
async function fetchWeather(key) {
  let returnObj = null;
  await fetch( `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${key}?apikey=${API_KEY}&details=true` )
    .then(res => res.json())
    .then(json => {
      returnObj =  {
        minTemp: json.DailyForecasts[0].Temperature.Minimum.Value,
        maxTemp: json.DailyForecasts[0].Temperature.Maximum.Value,
        effectiveCondition: json.Headline.Text,
        effectiveDate: new Date(json.Headline.EffectiveDate),
        dayRainChance: json.DailyForecasts[0].Day.RainProbability,  
        daySnowChance: json.DailyForecasts[0].Day.SnowProbability,
        dayWindSpeed: json.DailyForecasts[0].Day.Wind.Speed.Value + ' ' + json.DailyForecasts[0].Day.Wind.Speed.Unit,
        dayWindDirection: json.DailyForecasts[0].Day.Wind.Direction.Degrees + ' ' + json.DailyForecasts[0].Day.Wind.Direction.Localized,
        dayCondition: json.DailyForecasts[0].Day.IconPhrase,
        nightRainChance: json.DailyForecasts[0].Night.RainProbability,  
        nightSnowChance: json.DailyForecasts[0].Night.SnowProbability,
        nightWindSpeed: json.DailyForecasts[0].Night.Wind.Speed.Value + ' ' + json.DailyForecasts[0].Night.Wind.Speed.Unit,
        nightWindDirection: json.DailyForecasts[0].Night.Wind.Direction.Degrees + ' ' + json.DailyForecasts[0].Night.Wind.Direction.Localized,
        nightCondition: json.DailyForecasts[0].Night.IconPhrase
      };
    })
    .catch(error => {
      throw new Error(error.message);
    });

  // use when accuweather server is down 
  /*let res = require('../test.json');
  let resultObj = {
    minTemp: res.DailyForecasts[0].Temperature.Minimum.Value,
    maxTemp: res.DailyForecasts[0].Temperature.Maximum.Value,
    effectiveCondition: res.Headline.Text,
    effectiveDate: new Date(res.Headline.EffectiveDate),
    dayRainChance: res.DailyForecasts[0].Day.RainProbability,  
    daySnowChance: res.DailyForecasts[0].Day.SnowProbability,
    dayWindSpeed: res.DailyForecasts[0].Day.Wind.Speed.Value + ' ' + res.DailyForecasts[0].Day.Wind.Speed.Unit,
    dayWindDirection: res.DailyForecasts[0].Day.Wind.Direction.Degrees + ' ' + res.DailyForecasts[0].Day.Wind.Direction.Localized,
    dayCondition: res.DailyForecasts[0].Day.IconPhrase,
    nightRainChance: res.DailyForecasts[0].Night.RainProbability,  
    nightSnowChance: res.DailyForecasts[0].Night.SnowProbability,
    nightWindSpeed: res.DailyForecasts[0].Night.Wind.Speed.Value + ' ' + res.DailyForecasts[0].Night.Wind.Speed.Unit,
    nightWindDirection: res.DailyForecasts[0].Night.Wind.Direction.Degrees + ' ' + res.DailyForecasts[0].Night.Wind.Direction.Localized,
    nightCondition: res.DailyForecasts[0].Night.IconPhrase
  };
  return resultObj;
  */

  return returnObj;
}

function DayTab(props) {
  let weatherIconValue = (props.dayCondition == null) ? 'Default' : props.dayCondition.replace(/ /g, '_');
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: weatherIcons[weatherIconValue].color }
      ]}>
      <View style={{flex: 1, alignItems:'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons
          size={72}
          name={weatherIcons[weatherIconValue].icon}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Wind Speed</Text>  
        <Text style={styles.tempText}>{props.dayWindSpeed}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Wind Direction</Text>  
        <Text style={styles.tempText}>{props.dayWindDirection}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Chance of Rain</Text>  
        <Text style={styles.tempText}>{props.dayRainChance}%</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Chance of Snow</Text>  
        <Text style={styles.tempText}>{props.daySnowChance}%</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.tempText}>{props.dayCondition}</Text>
      </View>
    </View>
  );
}

function NightTab(props) {
  let weatherIconValue = (props.nightCondition == null) ? 'Default' : props.nightCondition.replace(/ /g, '_');

  return (
    <View style={[
      styles.container,
      { backgroundColor: weatherIcons[weatherIconValue].color }
      ]}>
      <View style={{flex: 1, alignItems:'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons
          size={72}
          name={weatherIcons[weatherIconValue].icon}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Wind Speed</Text>  
        <Text style={styles.tempText}>{props.nightWindSpeed}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Wind Direction</Text>  
        <Text style={styles.tempText}>{props.nightWindDirection}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Chance of Rain</Text>  
        <Text style={styles.tempText}>{props.nightRainChance}%</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Chance of Snow</Text>  
        <Text style={styles.tempText}>{props.nightSnowChance}%</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.tempText}>{props.nightCondition}</Text>
      </View>
    </View>
  );
}

function CurrentDetailsTab(props) {
  let weatherIconValue = 'Default';

  return (
    <View style={[
      styles.container,
      { backgroundColor: weatherIcons[weatherIconValue].color }
      ]}>
      <View style={{flex: 1, alignItems:'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons
          size={72}
          name={weatherIcons[weatherIconValue].icon}
        /> 
      </View>  
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Min Temp</Text>  
        <Text style={styles.tempText}>{props.minTemp}˚F</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Max Temp</Text>  
        <Text style={styles.tempText}>{props.maxTemp}˚F</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>Headline</Text>  
        <Text style={styles.title}>{props.effectiveCondition}, {Moment(props.effectiveDate).format('d MMM YYYY')} </Text>
      </View>
    </View>
  );
}

// function component
const WeatherDetailsScreen = ({ route, navigation }) => {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState({
    minTemp: 0,
    maxTemp: 0,
    effectiveCondition: null,
    effectiveDate: null,
    dayRainChance: 0,  
    daySnowChance: 0,
    dayWindSpeed: null,
    dayWindDirection: null,
    dayCondition: null,
    nightRainChance: 0,  
    nightSnowChance: 0,
    nightWindSpeed: null,
    nightWindDirection: null,
    nightCondition: null
  });

  const weatherDetails = route.params;
  const locationKey = weatherDetails.currentWeather.key;

  if (isLoading && error === null) {
    Geolocation.getCurrentPosition(
      async position => {
        let res = await fetchWeather(locationKey, position);
        
        setDetail(res);
        setIsLoading(false);
      },
      error => {
        setError('An error occurred. ' + error.message);
        setIsLoading(true);
      }
    );
  }
  const Tab = createMaterialTopTabNavigator();

  if (error == null) {
    return (
      <Tab.Navigator initialRouteName="Current Details">
        <Tab.Screen name="Current Details">
          {() => <CurrentDetailsTab {...detail} />}
        </Tab.Screen>
        <Tab.Screen name="Day">
          {() => <DayTab {...detail} />}
        </Tab.Screen>
        <Tab.Screen name="Night">
          {() => <NightTab {...detail} />}
        </Tab.Screen>
      </Tab.Navigator>    
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  tempText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  bodyContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 25
  },
  errorText: {
    fontSize: 30,
    color: '#f0f'
  }
});

export default WeatherDetailsScreen;