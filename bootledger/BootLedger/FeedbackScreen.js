import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import supabase from './supabase'; // Import supabase client

const FeedbackScreen = ({ route, navigation }) => {
  const [data, setData] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [originalityCheckOption, setOriginalityCheckOption] = useState('');
  const [qualityCheckOption, setQualityCheckOption] = useState('');
  const [comments, setComments] = useState('');
  const [showBanner, setShowBanner] = useState(false); // State for banner visibility
  const { barcodeType, barcodeData } = route.params;

  useEffect(() => {
    const fetchDataFromSupabase = async () => {
      try {
        let { data: Feedback, error } = await supabase
          .from('Product')
          .select("company_id")
          .eq('product_did', barcodeData)

        if (error) {
          console.error('Error fetching data from Supabase:', error.message);
          return;
        }

        setData(Feedback);
      } catch (error) {
        console.error('Error fetching data from Supabase:', error.message);
      }
    };

    fetchDataFromSupabase();
  }, [barcodeData]);

  const handleSendFeedback = async () => {
    const { error } = await supabase
      .from('Feedback')
      .insert([
        { company_id: data[0].company_id, feedback_customer_text: comments, product_did: barcodeData, feedback_type: 1, customer_email: 'demo@gmail.com' },
      ]);

    if (error) {
      console.error('Error sending feedback:', error.message);
    } else {
      setShowBanner(true); // Show the banner
      setTimeout(() => setShowBanner(false), 3000); // Hide the banner after 3 seconds
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#00001B',
      },
      headerTintColor: '#ffffff',
      headerShadowVisible: false,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#00001B" barStyle="light-content" />

      <Text style={styles.title}>Customer Feedback</Text>
      {data && (
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={data[0]?.company_id.toString()}
          placeholderTextColor="#a6b8ca"
          editable={false}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Product ID"
        value={barcodeData}
        placeholderTextColor="#a6b8ca"
        editable={false}
      />

      <Picker
        style={styles.input}
        selectedValue={feedbackCategory}
        onValueChange={(value) => setFeedbackCategory(value)}
        dropdownIconColor="#fff" // Set the color of the dropdown arrow to white
      >
        <Picker.Item label="Choose feedback category" value="" />
        <Picker.Item label="Originality Check" value="originalityCheck" />
        <Picker.Item label="Quality Check" value="qualityCheck" />
      </Picker>

      {feedbackCategory === 'originalityCheck' && (
        <>
          <Picker
            style={styles.input}
            selectedValue={originalityCheckOption}
            onValueChange={(value) => setOriginalityCheckOption(value)}
            dropdownIconColor="#fff" // Set the color of the dropdown arrow to white
          >
            <Picker.Item label="Is it original?" value="" />
            <Picker.Item label="Original" value="original" />
            <Picker.Item label="Not Original" value="notOriginal" />
          </Picker>

          <TextInput
            style={styles.input2}
            placeholder="Detailed Feedback"
            onChangeText={setComments}
            value={comments}
            multiline
            numberOfLines={4}
            placeholderTextColor="#a6b8ca"
          />
        </>
      )}

      {feedbackCategory === 'qualityCheck' && (
        <>
          <Picker
            style={styles.input}
            selectedValue={qualityCheckOption}
            onValueChange={(value) => setQualityCheckOption(value)}
            dropdownIconColor="#fff" // Set the color of the dropdown arrow to white
          >
            <Picker.Item label="Give points to the quality" value="" />
            {[...Array(11).keys()].map((point) => (
              <Picker.Item key={point} label={point.toString()} value={point.toString()} />
            ))}
          </Picker>

          <TextInput
            style={styles.input2}
            placeholder="Detailed Feedback"
            onChangeText={setComments}
            value={comments}
            multiline
            numberOfLines={4}
            placeholderTextColor="#a6b8ca"
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
        <Text style={styles.buttonText}>Send Feedback</Text>
      </TouchableOpacity>

      {/* Banner */}
      {showBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Your feedback is submitted</Text>
        </View>
      )}
    </View>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#00001B',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  input2: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#00001B',
    borderTopWidth: 1,
    borderTopColor: '#fff',
  },
  button: {
    backgroundColor: '#35a7ff',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
  },
  bannerText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  // ... other styles for input2 and Picker ...
});

export default FeedbackScreen;
