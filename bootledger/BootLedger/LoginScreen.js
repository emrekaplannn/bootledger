// LoginScreen.js
import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import supabase from './supabase'; // Import supabase client

const LoginScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#00001B',
      },
      headerTintColor: '#ffffff',
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
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
    {/*this is to prevent white space appearing at the top of the screen when scrolling bounces*/}
    <View style={{position: "absolute", bottom: 600, left: 0, right: 0, backgroundColor: '#00001b', height: 600}}/>
      <StatusBar backgroundColor="#00001B" barStyle="light-content" />
      <Image source={require('./assets/last_logo.png')} style={styles.logo} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="E-mail" 
          onChangeText={setEmail}
          onSubmitEditing={() => { this.passwordInput.focus(); }}
          value={email}
          placeholderTextColor="#a6b8ca"
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        ref = {(input) => { this.passwordInput = input; }}
        value={password}
        secureTextEntry={true}
        placeholderTextColor="#a6b8ca"
      />
      <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.signUpText} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? Sign Up
      </Text>
      <StatusBar style="auto" />
      {/*this is to prevent white space appearing at the bottom of the screen when scrolling bounces*/}
      <View style={{position: "absolute", bottom: -600, left: 0, right: 0, backgroundColor: '#00001b', height: 600}}/>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#00001B',
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
    borderColor: '#ffffff',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    color: '#ffffff',
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
    backgroundColor: '#35a7ff',
  },
  signUpText: {
    marginTop: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
/*try {
      // Check if the user exists in the custom "User" table
      const { data, error } = await supabase
        .from('User') // Replace 'User' with the actual table name
        .select()
        .eq('username', username)
        .single();

      if (error) {
        console.error('User fetch error:', error.message);
        return;
      }else {
        console.log('Login successful:', username);
        // Navigate to the "Feedback" screen upon successful login
        navigation.navigate('Feedback');
      }

    } catch (error) {
      console.error('Login error:', error.message);
    } */