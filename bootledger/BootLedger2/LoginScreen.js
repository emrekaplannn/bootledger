// LoginScreen.js
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import supabase from './supabase'; // Import supabase client

const LoginScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#35a7ff',
      },
      headerTintColor: '#000',
      headerShadowVisible: false,
    });
  }, [navigation]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
      
    });
    if (error) {
      console.error('User fetch error:', error.message);
      return;
    }else {
      console.log('Login successful:', email);
      // Navigate to the "Feedback" screen upon successful login
      navigation.navigate('MainMenu');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#35a7ff" barStyle="light-content" />
      <Image source={require('./assets/last_logo.png')} style={styles.logo} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          onChangeText={setEmail}
          value={email}
          placeholderTextColor="#333"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholderTextColor="#333"
      />
      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#35a7ff',
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  inputContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    color: '#00001B',
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 50,
    marginTop: 10,
    width: '70%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#00001B',
  },
});

export default LoginScreen;
