import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { dashboardApi, rpgApi } from '../../services/api';

const MOOD_EMOJI = {VERY_HAPPY:'😄',HAPPY:'😊',NEUTRAL:'😐',SAD:'😢',VERY_SAD:'😭',ANXIOUS:'😰',ANGRY:'😠',HOPEFUL:'🌟',TIRED:'😴',CALM:'😌'};

export default function HomeScreen({ navigation, user, onLogout }) {
  const [data, setData] = useState(null);
  const [rpg, setRpg] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const [d, r] = await Promise.all([dashboardApi.get(), rpgApi.getProfile().catch(()=>null)]);
      setData(d.data.data); if (r) setRpg(r.data.data);
    } catch {} setRefreshing(false);
  };
  useEffect(() => { load(); }, []);

  const hour = new Date().getHours();
  const greeting = hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';
  const name = user?.fullName?.split(' ')[0] || 'Friend';

  const actions = [
    {icon:'😊',label:'Log Mood',color:'#0ea5e9',screen:'MoodLog'},
    {icon:'📓',label:'Journal',color:'#10b981',screen:'Journal'},
    {icon:'🤗',label:'SAATHI AI',color:'#f97316',screen:'Companion'},
    {icon:'⚡',label:'Habits',color:'#8b5cf6',screen:'Habits'},
    {icon:'❤️',label:'Family',color:'#ef4444',screen:'Family'},
    {icon:'🌱',label:'Gratitude',color:'#f59e0b',screen:'Gratitude'},
  ];

  return (
    <ScrollView style={{flex:1,backgroundColor:'#f8f7ff'}} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={()=>{setRefreshing(true);load();}} colors={['#7c3aed']} />}>
      <LinearGradient colors={['#7c3aed','#a78bfa','#f97316']} style={{padding:24,paddingTop:56,paddingBottom:32}}>
        <Text style={{fontSize:14,color:'rgba(255,255,255,0.85)',marginBottom:2}}>{greeting},</Text>
        <Text style={{fontSize:28,fontWeight:'700',color:'white',marginBottom:8}}>{name} ✨</Text>
        {data?.dailyWisdom && <Text style={{fontSize:13,color:'rgba(255,255,255,0.8)',fontStyle:'italic',marginBottom:20}}>"{data.dailyWisdom}"</Text>}
        <View style={{flexDirection:'row',gap:10}}>
          {[{l:'Level',v:user?.level||1,i:'⚔️'},{l:'XP',v:user?.xpPoints||0,i:'⭐'},{l:'Streak',v:`${user?.streakDays||0}d`,i:'🔥'},{l:'Mood',v:data?.todayMood?MOOD_EMOJI[data.todayMood]:'—',i:''}].map(({l,v,i})=>(
            <View key={l} style={{flex:1,backgroundColor:'rgba(255,255,255,0.15)',borderRadius:12,padding:10}}>
              <Text style={{fontSize:16,fontWeight:'700',color:'white'}}>{i} {v}</Text>
              <Text style={{fontSize:10,color:'rgba(255,255,255,0.75)',marginTop:2}}>{l}</Text>
            </View>
          ))}
        </View>
        {rpg && (
          <View style={{marginTop:14}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}}>
              <Text style={{fontSize:11,color:'rgba(255,255,255,0.8)'}}>{rpg.completedQuestsToday||0}/{rpg.todayQuests?.length||0} quests done</Text>
              <Text style={{fontSize:11,color:'rgba(255,255,255,0.8)'}}>{rpg.progressPercent}% to next level</Text>
            </View>
            <View style={{backgroundColor:'rgba(255,255,255,0.2)',borderRadius:99,height:6,overflow:'hidden'}}>
              <View style={{height:'100%',backgroundColor:'rgba(255,255,255,0.9)',borderRadius:99,width:`${rpg.progressPercent}%`}} />
            </View>
          </View>
        )}
      </LinearGradient>

      <View style={{padding:20}}>
        {data?.dailyChallenge && (
          <View style={{flexDirection:'row',alignItems:'center',padding:16,borderRadius:16,marginBottom:20,backgroundColor:'#fff7ed',borderWidth:1,borderColor:'#fed7aa'}}>
            <Text style={{fontSize:22,marginRight:10}}>🎯</Text>
            <View style={{flex:1}}>
              <Text style={{fontSize:10,fontWeight:'700',color:'#92400e',letterSpacing:1}}>TODAY'S CHALLENGE</Text>
              <Text style={{fontSize:13,color:'#78350f',marginTop:2}}>{data.dailyChallenge}</Text>
            </View>
          </View>
        )}

        <Text style={{fontSize:16,fontWeight:'700',color:'#1c1917',marginBottom:12}}>Quick Actions</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:10,marginBottom:24}}>
          {actions.map(({icon,label,color,screen})=>(
            <TouchableOpacity key={label} onPress={()=>navigation.navigate(screen)}
              style={{width:'30%',padding:14,borderRadius:14,alignItems:'center',backgroundColor:color+'18',borderWidth:1,borderColor:color+'30'}}>
              <Text style={{fontSize:26,marginBottom:5}}>{icon}</Text>
              <Text style={{fontSize:11,fontWeight:'600',color,textAlign:'center'}}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {data?.recentMoods?.length>0 && (
          <View>
            <Text style={{fontSize:16,fontWeight:'700',color:'#1c1917',marginBottom:12}}>Your Week 🌈</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>
              {data.recentMoods.map((m,i)=>(
                <View key={i} style={{alignItems:'center',marginRight:10,padding:12,borderRadius:12,backgroundColor:'white',shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.06,shadowRadius:4,elevation:2}}>
                  <Text style={{fontSize:24}}>{MOOD_EMOJI[m.mood]||'😐'}</Text>
                  <Text style={{fontSize:10,color:'#6b7280',marginTop:4}}>{new Date(m.date).toLocaleDateString('en',{weekday:'short'})}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <TouchableOpacity onPress={onLogout} style={{alignItems:'center',padding:14,marginBottom:32}}>
          <Text style={{fontSize:14,color:'#ef4444'}}>Sign out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
