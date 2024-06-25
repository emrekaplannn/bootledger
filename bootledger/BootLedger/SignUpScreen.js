// SignUpScreen.js
import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, StatusBar} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import supabase from './supabase'; // Import supabase client

const SignUpScreen = ({ navigation }) => {
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: 'http://localhost:3000/auth/confirm',
          data: {
            username:username,
          }
        },
      });
      console.log(response);
      if (!(response.data.user)) {
        // supabase error
        return { success: false, error: response };
      }
      //console.log(response.data)
  
      const {error: insertError} = await supabase
      .from('User')
      .insert([
        {
         user_id: response.data.session?.user.id,
         email: email,
         privacy_policy: false,
         user_type: "customer",
         company_id: null,
         username: username,
        }
      ])
      if (insertError){
        console.error('User creation error:', insertError.message);
        } else {
          console.log('User created successfully:', response.data);
          // Navigate to the next screen or perform additional actions
          navigation.navigate('MainMenu');
        }
  
      return { success: true };
    } catch (error) {
      console.error('Sign-up error:', error.message);
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
            placeholder="Email Address"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            placeholderTextColor="#a6b8ca"
            onSubmitEditing={() => { this.usernameInput.focus()}}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            ref={(input) => {this.usernameInput = input;}}
            onSubmitEditing={() => { this.passwordInput.focus()}}
            style={styles.input}
            placeholder="Username"
            onChangeText={setUsername}
            value={username}
            placeholderTextColor="#a6b8ca"
          />
        </View>
        <TextInput
          style={styles.input}
          ref = {(input) => {this.passwordInput = input;}}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholderTextColor="#a6b8ca"
        />
        <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#ffffff',
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
  signUpButton: {
    backgroundColor: '#35a7ff',
  },
});

export default SignUpScreen;