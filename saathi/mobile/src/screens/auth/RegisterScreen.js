import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
export default function RegisterScreen({ navigation, onRegister }) {
  const [form, setForm] = useState({fullName:'',username:'',email:'',password:''});
  const [loading, setLoading] = useState(false);
  const handleRegister = async () => {
    if (!form.fullName||!form.email||!form.password) return Alert.alert('Missing fields','Fill all required fields');
    if (form.password.length<6) return Alert.alert('Too short','Password must be 6+ characters');
    setLoading(true);
    try { await onRegister(form.fullName, form.username||form.email.split('@')[0], form.email, form.password); }
    catch (e) { Alert.alert('Failed', e?.message || 'Please try again'); }
    setLoading(false);
  };
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}>
      <LinearGradient colors={['#f8f7ff','#ede9fe','#fce7f3']} style={{flex:1}}>
        <ScrollView contentContainerStyle={{padding:24,paddingTop:50,alignItems:'center'}}>
          <View style={{alignItems:'center',marginBottom:28}}>
            <LinearGradient colors={['#7c3aed','#a78bfa']} style={{width:64,height:64,borderRadius:18,alignItems:'center',justifyContent:'center',marginBottom:10}}>
              <Text style={{fontSize:28}}>🌟</Text>
            </LinearGradient>
            <Text style={{fontSize:26,fontWeight:'700',color:'#7c3aed'}}>Join SAATHI</Text>
          </View>
          <View style={{backgroundColor:'white',borderRadius:20,padding:24,width:'100%',maxWidth:400,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.08,shadowRadius:16,elevation:4}}>
            {[{k:'fullName',l:'Full Name',p:'Your full name'},{k:'username',l:'Username',p:'Choose username'},{k:'email',l:'Email',p:'your@email.com',t:'email-address'},{k:'password',l:'Password',p:'Min 6 chars',s:true}].map(({k,l,p,t,s}) => (
              <View key={k}>
                <Text style={{fontSize:13,fontWeight:'600',color:'#6b7280',marginBottom:6}}>{l}</Text>
                <TextInput style={{borderWidth:1.5,borderColor:'#e5e7eb',borderRadius:12,padding:13,fontSize:15,marginBottom:14,color:'#1c1917'}}
                  placeholder={p} value={form[k]} onChangeText={v=>setForm(f=>({...f,[k]:v}))}
                  keyboardType={t||'default'} autoCapitalize="none" secureTextEntry={!!s} />
              </View>
            ))}
            <TouchableOpacity style={[{backgroundColor:'#7c3aed',borderRadius:14,padding:14,alignItems:'center',marginTop:4},loading&&{opacity:0.6}]} onPress={handleRegister} disabled={loading}>
              <Text style={{color:'white',fontWeight:'700',fontSize:16}}>{loading?'Creating...':'Create Account'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Login')} style={{flexDirection:'row',justifyContent:'center',marginTop:18}}>
              <Text style={{fontSize:14,color:'#6b7280'}}>Have an account? </Text>
              <Text style={{fontSize:14,color:'#7c3aed',fontWeight:'700'}}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
