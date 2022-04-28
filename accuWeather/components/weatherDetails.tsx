import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_KEY } from '../utils/key';
import { weatherIcons } from '../utils/weatherIcons';
import Moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Geolocation from 'react-native-geolocation-service';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

// use the location key to get the weather
async function fetchWeather(key: string) {
  let returnObj = {};
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
  /*let res = require('../testDocs/test.json');
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

function DayTab(props: Object) {
  let weatherIconValue = (Object(props).dayCondition === "") ? 'Default' : Object(props).dayCondition.replace(/ /g, '_');
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: Object(weatherIcons)[weatherIconValue].color }
      ]}>
      <View style={{flex: 1, alignItems:'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons
          size={72}
          name={Object(weatherIcons)[weatherIconValue].icon}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Wind Speed</Text>  
        <Text style={styles.tempText}>{Object(props).dayWindSpeed}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Wind Direction</Text>  
        <Text style={styles.tempText}>{Object(props).dayWindDirection}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Chance of Rain</Text>  
        <Text style={styles.tempText}>{Object(props).dayRainChance}%</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Chance of Snow</Text>  
        <Text style={styles.tempText}>{Object(props).daySnowChance}%</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.tempText}>{Object(props).dayCondition}</Text>
      </View>
    </View>
  );
}

function NightTab(props: Object) {
  let weatherIconValue = (Object(props).nightCondition === "") ? 'Default' : Object(props).nightCondition.replace(/ /g, '_');

  return (
    <View style={[
      styles.container,
      { backgroundColor: Object(weatherIcons)[weatherIconValue].color }
      ]}>
      <View style={{flex: 1, alignItems:'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons
          size={72}
          name={Object(weatherIcons)[weatherIconValue].icon}
        />
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Wind Speed</Text>  
        <Text style={styles.tempText}>{Object(props).nightWindSpeed}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Wind Direction</Text>  
        <Text style={styles.tempText}>{Object(props).nightWindDirection}</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Chance of Rain</Text>  
        <Text style={styles.tempText}>{Object(props).nightRainChance}%</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Chance of Snow</Text>  
        <Text style={styles.tempText}>{Object(props).nightSnowChance}%</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.tempText}>{Object(props).nightCondition}</Text>
      </View>
    </View>
  );
}

function CurrentDetailsTab(props: Object) {
  let weatherIconValue = 'Default';

  return (
    <View style={[
      styles.container,
      { backgroundColor: Object(weatherIcons)[weatherIconValue].color }
      ]}>
      <View style={{flex: 1, alignItems:'center', justifyContent: 'center' }}>
        <MaterialCommunityIcons
          size={72}
          name={Object(weatherIcons)[weatherIconValue].icon}
        /> 
      </View>  
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Min Temp</Text>  
        <Text style={styles.tempText}>{Object(props).minTemp}˚F</Text>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>Max Temp</Text>  
        <Text style={styles.tempText}>{Object(props).maxTemp}˚F</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>Headline</Text>  
        <Text style={styles.title}>{Object(props).effectiveCondition}, {Moment(Object(props).effectiveDate).format('d MMM YYYY')} </Text>
      </View>
    </View>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, "WeatherDeets">

// function component
const WeatherDetailsScreen = ({ route }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [detail, setDetail] = useState<object>({
    minTemp: 0,
    maxTemp: 0,
    effectiveCondition: "",
    effectiveDate: null,
    dayRainChance: 0,  
    daySnowChance: 0,
    dayWindSpeed: "",
    dayWindDirection: "",
    dayCondition: "",
    nightRainChance: 0,  
    nightSnowChance: 0,
    nightWindSpeed: "",
    nightWindDirection: "",
    nightCondition: ""
  });

  const weatherDetails = route.params;
  const locationKey = Object(weatherDetails).currentWeather.key;

  if (isLoading && error === "") {
    Geolocation.getCurrentPosition(
      async position => {
        let res = await fetchWeather(locationKey);
        
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

  if (error === "") {
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