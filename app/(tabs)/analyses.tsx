import React from 'react';
import {ScrollView,View,Text,TouchableOpacity} from 'react-native';
import {router} from 'expo-router';
import {C} from '../../src/theme/colors';
import {Card,Btn,PageTitle} from '../../src/components/UI';
import {useDemo} from '../../src/store/useDemo';
export default function Analyses(){const analyses=useDemo(s=>s.analyses);return <ScrollView style={{backgroundColor:C.bg}} contentContainerStyle={{padding:20,paddingTop:55}}><PageTitle title="Suas análises" subtitle="Acompanhe as oportunidades que você avaliou."/>{analyses.map(a=><TouchableOpacity key={a.id} onPress={()=>router.push({pathname:'/analysis/result',params:{id:a.id}})}><Card><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><View style={{flex:1}}><Text style={{fontWeight:'800',fontSize:16,color:C.text}}>{a.title}</Text><Text style={{color:C.muted,marginTop:7}}>{a.company} • {a.status}</Text></View><Text style={{fontSize:23,fontWeight:'900',color:C.primary}}>{a.score}%</Text></View></Card></TouchableOpacity>)}<Btn title="+ Nova análise" onPress={()=>router.push('/analysis/new')}/></ScrollView>}
