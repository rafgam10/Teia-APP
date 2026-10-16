import React from 'react';
import {Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import {C} from '../src/theme/colors';
export default function Layout(){return <><StatusBar style="dark"/><Stack screenOptions={{headerStyle:{backgroundColor:C.bg},headerTintColor:C.green,headerShadowVisible:false,contentStyle:{backgroundColor:C.bg}}}><Stack.Screen name="(tabs)" options={{headerShown:false}}/><Stack.Screen name="analysis/new" options={{title:'Nova análise'}}/><Stack.Screen name="analysis/upload" options={{title:'Currículo'}}/><Stack.Screen name="analysis/result" options={{title:'Resultado'}}/></Stack></>}
