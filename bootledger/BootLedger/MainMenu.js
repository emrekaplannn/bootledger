import {React, useLayoutEffect} from 'react';
import { View, Button, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import supabase from './supabase';

const MainMenu = ({ navigation }) => {
    useLayoutEffect(() => {
        // adjust the navigation bar
        navigation.setOptions({
          title: 'Main Menu',
          headerStyle: {
            backgroundColor: '#00001B',
          },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
          headerLeft: null
        });
      }, [navigation]);
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#00001B" barStyle="light-content" />
            <View style={styles.topContainer}>
                <Pressable style = {styles.menuButton} onPress={() => navigation.navigate("Camera") }>
                    <Text style={styles.menuButtonText}>Submit New Feedback</Text>
                </Pressable>
                <View style={styles.verticalSpaceBetweenButtons}/>
                <Pressable style = {styles.menuButton} onPress={() => navigation.navigate("PreviousFeedbacks") }>
                    <Text style={styles.menuButtonText}>Previous Feedbacks</Text>
                </Pressable>
                <View style={styles.verticalSpaceBetweenButtons}/>
                <Pressable style = {styles.menuButton} onPress={() => console.log("This is not implemented yet!") /*navigation.navigate("Camera")*/ }>
                    <Text style={styles.menuButtonText}>Profile</Text>
                </Pressable>
            </View>
            <View style={styles.bottomContainer}>
                <Pressable 
                        style={styles.logoutButton}
                        onPress={() => { 
                        supabase.auth.signOut();
                        navigation.navigate("BootLedger");
                        } }>
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#00001B',
    },
    topContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 0,
        backgroundColor: '#00001B',
        width: '100%',

      },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#00001B',
        width: '100%',

      },
    inputContainer: {
      width: '100%',
      borderBottomWidth: 1,
      borderColor: '#ffffff',
      marginBottom: 10,
    },
    logoutButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 50,
        marginTop: 10,
        width: '50%',
        backgroundColor: '#35a7ff',
      },
    logoutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    menuButton: {
        width: '82%',
        paddingVertical: 20,
        paddingHorizontal: 32,
        elevation: 5,
        backgroundColor: '#35a7ff',
        borderRadius: 50,

      },
    verticalSpaceBetweenButtons: {
        width: 300,
        height: 25
    },
    menuButtonText: {
      color: '#ffffff',
      fontSize: 20,
      textAlign: 'center',
      fontWeight: 'bold',
    }
  });

export default MainMenu;