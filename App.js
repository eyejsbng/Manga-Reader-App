import React , { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'

import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import Manga from './pages/Manga';
import Chapter from './pages/Chapter';
import Genre from './pages/Genre';
import * as Font from 'expo-font';

function getFonts() {
	return Font.loadAsync({
		'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
		'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf')
	})
}

const Stack = createStackNavigator();

function MyStack() {
	console.reportErrorsAsExceptions = false;
	return (
		<Stack.Navigator mode="card" headerMode="screen" initialRouteName="Home" screenOptions={{
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			gestureEnabled: true,
		}}>
			<Stack.Screen name="Home" component={HomePage} options={{headerShown: false}}/>
			<Stack.Screen name="Manga" component={Manga} 
			options={({ route }) => ({ title: route.params.title,headerTintColor: '#fff',  
			headerStyle: { backgroundColor:'#ff8303'}, headerShown:false})} />
			<Stack.Screen name="Search" component={SearchPage} 
			options={{ headerShown: false}}/>
			<Stack.Screen name="Chapter" component={Chapter} options={{headerShown: false}}/>
			<Stack.Screen name="Genre" component={Genre} options={{headerShown: false}}/>	

		</Stack.Navigator>
	)
}

export default function App() {

	useEffect(() => {
		getFonts();
	}, [])

	return (
		<NavigationContainer>
			<MyStack/>
			
		</NavigationContainer>

	);
 
}

