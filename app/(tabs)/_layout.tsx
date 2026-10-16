import React from 'react';
import {Tabs} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';
import {C} from '../../src/theme/colors';
export default function TabsLayout(){return <Tabs screenOptions={{headerShown:false,tabBarActiveTintColor:C.primary,tabBarInactiveTintColor:C.muted,tabBarStyle:{height:65,paddingTop:6,paddingBottom:8,backgroundColor:C.white}}}>
<Tabs.Screen name="index" options={{title:'Início',tabBarIcon:({color,size})=><Ionicons name="home-outline" size={size} color={color}/>}}/>
<Tabs.Screen name="analyses" options={{title:'Análises',tabBarIcon:({color,size})=><Ionicons name="briefcase-outline" size={size} color={color}/>}}/>
<Tabs.Screen name="journey" options={{title:'Jornada',tabBarIcon:({color,size})=><Ionicons name="map-outline" size={size} color={color}/>}}/>
<Tabs.Screen name="resume" options={{title:'Currículo',tabBarIcon:({color,size})=><Ionicons name="document-text-outline" size={size} color={color}/>}}/>
</Tabs>}
