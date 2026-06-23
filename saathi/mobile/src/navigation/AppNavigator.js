import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import LoginScreen     from '../screens/auth/LoginScreen';
import RegisterScreen  from '../screens/auth/RegisterScreen';
import HomeScreen      from '../screens/dashboard/HomeScreen';
import CompanionScreen from '../screens/companion/CompanionScreen';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

function AuthStack({ onLogin, onRegister }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown:false }}>
      <Stack.Screen name="Login"    children={p => <LoginScreen    {...p} onLogin={onLogin} />} />
      <Stack.Screen name="Register" children={p => <RegisterScreen {...p} onRegister={onRegister} />} />
    </Stack.Navigator>
  );
}

function MainTabs({ user, onLogout, navigation }) {
  const tab = (label, emoji, component) => ({
    tabBarIcon: ({ color, size }) => <Text style={{ fontSize:20 }}>{emoji}</Text>,
    tabBarLabel: label,
    tabBarActiveTintColor: '#7c3aed',
    tabBarInactiveTintColor: '#9ca3af',
  });

  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor:'white', borderTopColor:'#f3f4f6', paddingBottom:4, height:60 },
      tabBarActiveTintColor: '#7c3aed',
      tabBarInactiveTintColor: '#9ca3af',
    }}>
      <Tab.Screen name="Home" options={{ title:'Home', tabBarIcon:({color})=><Text style={{fontSize:20}}>🏠</Text> }}
        children={p => <HomeScreen {...p} user={user} onLogout={onLogout} />} />
      <Tab.Screen name="Companion" options={{ title:'SAATHI AI', tabBarIcon:()=><Text style={{fontSize:20}}>🤗</Text> }}
        component={CompanionScreen} />
      <Tab.Screen name="MoodLog" options={{ title:'Mood', tabBarIcon:()=><Text style={{fontSize:20}}>😊</Text> }}
        children={() => <Text style={{textAlign:'center',marginTop:80,fontSize:18,color:'#7c3aed'}}>Mood screen — see web app</Text>} />
      <Tab.Screen name="Journal" options={{ title:'Journal', tabBarIcon:()=><Text style={{fontSize:20}}>📓</Text> }}
        children={() => <Text style={{textAlign:'center',marginTop:80,fontSize:18,color:'#7c3aed'}}>Journal screen — see web app</Text>} />
      <Tab.Screen name="Wellness" options={{ title:'Wellness', tabBarIcon:()=><Text style={{fontSize:20}}>🌿</Text> }}
        children={() => <Text style={{textAlign:'center',marginTop:80,fontSize:18,color:'#7c3aed'}}>Wellness — see web app</Text>} />
    </Tab.Navigator>
  );
}

export default function AppNavigator({ user, loading, onLogin, onRegister, onLogout }) {
  if (loading) return null;
  return (
    <NavigationContainer>
      {user ? <MainTabs user={user} onLogout={onLogout} /> : <AuthStack onLogin={onLogin} onRegister={onRegister} />}
    </NavigationContainer>
  );
}
