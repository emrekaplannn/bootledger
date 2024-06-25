//Bootledger.js
import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image ,StatusBar} from 'react-native';

const EntranceScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#00001B', // Dark blue color for the header background
      },
      headerTintColor: '#ffffff', // White color for the header title and buttons
      headerShadowVisible: false, // Optional: hide the shadow under the header
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Image source={require('./assets/last_logo.png')} style={styles.logo} />
      <StatusBar backgroundColor="#00001b" barStyle="light-content" />
      <Text style={styles.title}>Welcome to BootLedger</Text>
      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button2, styles.signUpButton]}
        onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText2}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#00001B', // Use a consistent dark blue background
  },
  logo: {
    width: 300, // Adjust the size of your logo accordingly
    height: 300, // Adjust the size of your logo accordingly
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#ffffff', // White text color for contrast
    marginBottom: 70,
    marginTop: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 15,
    width: '70%', // Match width to login/signup screen buttons for consistency
    alignItems: 'center', // Center text in button
  },
  button2: {
    paddingVertical: 6,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 15,
    width: '100%', // Match width to login/signup screen buttons for consistency
    alignItems: 'center', // Center text in button
  },
  buttonText: {
    color: '#fff', // Dark blue text for contrast on light blue button
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonText2: {
    color: '#fff', // Dark blue text for contrast on light blue button
    //fontWeight: 'bold',
    fontSize: 15,
    alignItems: 'center', // Center text in button
  },
  loginButton: {
    backgroundColor: '#35a7ff', // A lighter blue button color for contrast
  },
  signUpButton: {
    backgroundColor: '#00001B', // White button with blue text for contrast
  },
});

export default EntranceScreen;
