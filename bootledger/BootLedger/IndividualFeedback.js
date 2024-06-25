import { React, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import supabase from './supabase';

const imagesBucketUrl = "";

const IndividualFeedback = ({ route, navigation }) => {
    const feedback = route.params.feedback;
    const [feedbackImageSource, setFeedbackImageSource] = useState('');
    useLayoutEffect(() => {
        navigation.setOptions({
          headerStyle: {
            backgroundColor: '#00001B',
          },
          headerTintColor: '#ffffff',
          headerShadowVisible: false,
          title: "Feedback Details" 
        });
      }, [navigation]);

      const [user, setUser] = useState('');

      useEffect(() => {
        const getCurrentUser = async() => {
        return await supabase.auth.getSession()
                .then((data, error) => {
                   console.log("Got the session at individual feedback screen:");
                   console.log(data.data.session.user, error);
                   setUser(data.data.session.user)
                  });
    
        }
        getCurrentUser();
      }, []);

      // get the feedback's image source to load it.
      useEffect(() => {
        setFeedbackImageSource(supabase
            .storage
            .from('images')
            .getPublicUrl(user.id + '/' + feedback.feedback_image).data.publicUrl);
            console.log("got the image source ready. it is", feedbackImageSource);
        
      }, [feedback, user]);

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: "numeric", month: "long", year:  "numeric"};
        console.log("PRODUCT", feedback)
        return date.toLocaleDateString(undefined, options)
      }


      return(
        <ScrollView>
            <View style={{position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: '#00001b', height: 0}}/>
            <View style={styles.container}>
                <View style={styles.feedbackContainer}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Feedback ID:</Text>
                        <Text style={styles.value}>{feedback.feedback_id}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Product DID:</Text>
                        <Text style={styles.value}>{feedback.Product.product_did}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Feedback Date:</Text>
                        <Text style={styles.value}>{formatDate(feedback.created_at)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Company Name:</Text>
                        <Text style={styles.value}>{feedback.Company.company_name || "company name undefined"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Product Name:</Text>
                        <Text style={styles.value}>{feedback.Product.product_name || "product name undefined"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Feedback Text:</Text>
                        <Text style={styles.value}>{feedback.feedback_customer_text}</Text>
                    </View>
                    { feedback.feedback_image && <View style={styles.row}>
                        <Text style={styles.label}>Feedback Image:</Text>
                        {feedback.feedback_image && (
                            <Image source={{ uri: (feedbackImageSource ? feedbackImageSource : "https://i.sstatic.net/FsMtu.gif") }} style={styles.image} />
                        )}
                    </View> }
                    <View style={styles.row}>
                        <Text style={styles.label}>Company Answer:</Text>
                        <Text style={styles.value}>{feedback.feedback_company_answer ?? 'No answer yet'}</Text>
                    </View>
                </View>
            </View>
            <View style={{position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: '#00001b', height: 0}}/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'left',
      padding: 20,
      backgroundColor: '#00001B',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color:"white",
    },
    feedbackContainer: {
        backgroundColor: '#00001B',
        borderRadius: 10,
        marginBottom: 300,
        padding: 20,
    },
    row: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#35a7ff',
    },
    value: {
        fontSize: 16,
        flexWrap: 'wrap',
        flexDirection: 'row',
        color: '#fff',
        
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
        marginTop: 10,
    },
});

export default IndividualFeedback;