import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Missing fields', 'Please enter email and password');
    setLoading(true);
    try { await onLogin(email, password); }
    catch (e) { Alert.alert('Login failed', e?.message || 'Invalid credentials'); }
    setLoading(false);
  };
  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}>
      <LinearGradient colors={['#f8f7ff','#ede9fe','#fce7f3']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.inner}>
          <View style={styles.logoBox}>
            <LinearGradient colors={['#7c3aed','#a78bfa']} style={styles.logoBg}>
              <Text style={{fontSize:32}}>🌟</Text>
            </LinearGradient>
            <Text style={styles.appName}>SAATHI</Text>
            <Text style={styles.tagline}>You are not alone</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome back</Text>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity style={[styles.btn,loading&&{opacity:0.6}]} onPress={handleLogin} disabled={loading}>
              <Text style={styles.btnText}>{loading?'Signing in...':'Sign In'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Register')} style={{flexDirection:'row',justifyContent:'center',marginTop:18}}>
              <Text style={{fontSize:14,color:'#6b7280'}}>No account? </Text>
              <Text style={{fontSize:14,color:'#7c3aed',fontWeight:'700'}}>Create one</Text>
            </TouchableOpacity>
          </View>
          <Text style={{marginTop:24,fontSize:13,color:'#9ca3af'}}>💜 SAATHI is here for you</Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container:{flex:1}, inner:{padding:24,paddingTop:60,alignItems:'center',minHeight:'100%'},
  logoBox:{alignItems:'center',marginBottom:32},
  logoBg:{width:70,height:70,borderRadius:20,alignItems:'center',justifyContent:'center',marginBottom:12},
  appName:{fontSize:30,fontWeight:'700',color:'#7c3aed'},
  tagline:{fontSize:14,color:'#6b7280',marginTop:4},
  card:{backgroundColor:'white',borderRadius:20,padding:28,width:'100%',maxWidth:400,shadowColor:'#000',shadowOffset:{width:0,height:4},shadowOpacity:0.08,shadowRadius:16,elevation:4},
  cardTitle:{fontSize:22,fontWeight:'700',color:'#1c1917',marginBottom:22},
  label:{fontSize:13,fontWeight:'600',color:'#6b7280',marginBottom:6},
  input:{borderWidth:1.5,borderColor:'#e5e7eb',borderRadius:12,padding:13,fontSize:15,marginBottom:14,color:'#1c1917'},
  btn:{backgroundColor:'#7c3aed',borderRadius:14,padding:14,alignItems:'center',marginTop:4},
  btnText:{color:'white',fontWeight:'700',fontSize:16},
});
