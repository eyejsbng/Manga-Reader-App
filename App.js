import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack'
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import Manga from './pages/Manga';
import Chapter from './pages/Chapter';

const Stack = createStackNavigator();
function MyStack() {
	return (
		<Stack.Navigator initialRouteName="Home">
			<Stack.Screen name="Home" component={HomePage} options={{headerShown: false}}/>
			<Stack.Screen name="Manga" component={Manga} 
			options={({ route }) => ({ title: route.params.title})}/>
			<Stack.Screen name="Search" component={SearchPage} options={{ headerShown: false}}/>
			<Stack.Screen name="Chapter" component={Chapter} options={{headerShown: false}}/>
		</Stack.Navigator>
	)
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack/>
			
    </NavigationContainer>

  );
}

