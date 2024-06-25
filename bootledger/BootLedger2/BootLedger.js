//Bootledger.js
import React, { useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image ,StatusBar} from 'react-native';

const EntranceScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#35a7ff', // Dark blue color for the header background
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold', // Make the header title bold
      }, // White color for the header title and buttons
      headerShadowVisible: false, // Optional: hide the shadow under the header
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Text style={styles.title2}>Supply Chain Management{'\n'}

       System</Text>
      <Image source={require('./assets/last_logo.png')} style={styles.logo} />
      <StatusBar backgroundColor="#35a7ff" barStyle="light-content" />
      <Text style={styles.title}>Welcome to BootLedger</Text>
      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
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
    backgroundColor: '#35a7ff', // Use a consistent dark blue background
  },
  logo: {
    width: 300, // Adjust the size of your logo accordingly
    height: 300, // Adjust the size of your logo accordingly
    resizeMode: 'contain',
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#000', // White text color for contrast
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',

  },
  title2: {
    fontSize: 24,
    color: '#000',
    position: 'absolute',
    fontWeight: 'bold',

    top: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    paddingTop: 20, // Adjust as needed // Aligns content to the top
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginBottom: 15,
    width: '70%', // Match width to login/signup screen buttons for consistency
    alignItems: 'center', // Center text in button
  },
  buttonText: {
    color: '#fff', // Dark blue text for contrast on light blue button
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#00001B', // A lighter blue button color for contrast
  },
});

export default EntranceScreen;
