import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import WelcomeScreen from '../screens/WelcomeScreen'
import SearchScreen from '../screens/SearchScreen'
import DetailsScreen from '../screens/DetailsScreen'
import AuxilioScreen from '../screens/AuxilioScreen'
import AuxilioDetailsScreen from '../screens/AuxilioDetailsScreen'

const Stack = createStackNavigator()

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Busca de Emendas' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes da Emenda' }} />
      <Stack.Screen name="Auxilio" component={AuxilioScreen} options={{ title: 'Consulta Auxílio Emergencial' }} />
      <Stack.Screen name="AuxilioDetails" component={AuxilioDetailsScreen} options={{ title: 'Detalhes do Auxílio Emergencial' }} />
    </Stack.Navigator>
  </NavigationContainer>
)

export default AppNavigator