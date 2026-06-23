import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { companionApi } from '../../services/api';

const SUGGESTIONS = ["I'm feeling overwhelmed","I need motivation","I'm feeling lonely","Help me reflect on my day"];

export default function CompanionScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => { companionApi.getHistory().then(r=>{setMessages(r.data.data||[]);setFetching(false);}).catch(()=>setFetching(false)); }, []);
  useEffect(() => { setTimeout(()=>scrollRef.current?.scrollToEnd({animated:true}),100); }, [messages,loading]);

  const send = async (text) => {
    const msg = text||input.trim(); if (!msg) return;
    setInput(''); setMessages(prev=>[...prev,{role:'USER',content:msg,createdAt:new Date().toISOString()}]); setLoading(true);
    try { const res=await companionApi.chat(msg); setMessages(prev=>[...prev,res.data.data]); }
    catch { setMessages(prev=>[...prev,{role:'ASSISTANT',content:"I'm here with you 💜",createdAt:new Date().toISOString()}]); }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'} keyboardVerticalOffset={90}>
      <View style={{flex:1,backgroundColor:'#f8f7ff'}}>
        <LinearGradient colors={['#7c3aed','#f97316']} style={{flexDirection:'row',alignItems:'center',gap:12,padding:20,paddingTop:56}}>
          <Text style={{fontSize:32}}>🤗</Text>
          <View><Text style={{fontSize:20,fontWeight:'700',color:'white'}}>SAATHI</Text><Text style={{fontSize:12,color:'rgba(255,255,255,0.8)'}}>Always here for you</Text></View>
        </LinearGradient>

        <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:16}} showsVerticalScrollIndicator={false}>
          {fetching ? <ActivityIndicator color="#7c3aed" style={{marginTop:40}} /> :
           messages.length===0 ? (
            <View style={{alignItems:'center',paddingTop:40}}>
              <Text style={{fontSize:56,marginBottom:12}}>🤗</Text>
              <Text style={{fontSize:22,fontWeight:'700',color:'#1c1917',marginBottom:8}}>Hey, I'm SAATHI</Text>
              <Text style={{fontSize:14,color:'#6b7280',textAlign:'center',maxWidth:280,marginBottom:24,lineHeight:22}}>I'm here to listen without judgment. What's on your mind?</Text>
              <View style={{gap:8,width:'100%'}}>
                {SUGGESTIONS.map(s=>(
                  <TouchableOpacity key={s} onPress={()=>send(s)} style={{backgroundColor:'white',borderRadius:12,padding:12,borderWidth:1,borderColor:'#ddd6fe'}}>
                    <Text style={{fontSize:13,color:'#7c3aed',textAlign:'center'}}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
           ) : (
            <>
              {messages.map((msg,i)=>(
                <View key={i} style={{flexDirection:'row',alignItems:'flex-end',marginBottom:14,justifyContent:msg.role==='USER'?'flex-end':'flex-start'}}>
                  {msg.role==='ASSISTANT' && <Text style={{fontSize:24,marginRight:8}}>🤗</Text>}
                  <View style={[{maxWidth:'72%',padding:14,borderRadius:18},msg.role==='USER'?{backgroundColor:'#7c3aed',borderBottomRightRadius:4}:{backgroundColor:'white',borderBottomLeftRadius:4,shadowColor:'#000',shadowOffset:{width:0,height:1},shadowOpacity:0.06,shadowRadius:4,elevation:2}]}>
                    <Text style={{color:msg.role==='USER'?'white':'#1c1917',fontSize:14,lineHeight:22}}>{msg.content}</Text>
                  </View>
                </View>
              ))}
              {loading && (
                <View style={{flexDirection:'row',alignItems:'flex-end',marginBottom:14}}>
                  <Text style={{fontSize:24,marginRight:8}}>🤗</Text>
                  <View style={{backgroundColor:'white',padding:16,borderRadius:18,borderBottomLeftRadius:4}}>
                    <View style={{flexDirection:'row',gap:5}}>
                      {[0,1,2].map(i=><View key={i} style={{width:8,height:8,borderRadius:4,backgroundColor:'#7c3aed'}} />)}
                    </View>
                  </View>
                </View>
              )}
            </>
           )}
        </ScrollView>

        <View style={{flexDirection:'row',gap:8,padding:12,paddingBottom:24,backgroundColor:'white',borderTopWidth:1,borderTopColor:'#f3f4f6'}}>
          <TextInput style={{flex:1,borderWidth:1.5,borderColor:'#e5e7eb',borderRadius:16,padding:12,fontSize:14,color:'#1c1917',maxHeight:100}}
            value={input} onChangeText={setInput} placeholder="Share what's on your mind... 💜" placeholderTextColor="#9ca3af" multiline />
          <TouchableOpacity onPress={()=>send()} disabled={loading||!input.trim()} style={{alignSelf:'flex-end'}}>
            <LinearGradient colors={['#7c3aed','#a78bfa']} style={{width:44,height:44,borderRadius:14,alignItems:'center',justifyContent:'center'}}>
              <Text style={{fontSize:18,color:'white'}}>➤</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
