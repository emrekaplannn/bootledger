import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Modal,
  Pressable
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import supabase from './supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const FeedbackScreen = ({ route, navigation }) => {
  const [data, setData] = useState('');
  const [companyName, setCompanyName] = useState(''); // New state for company name
  const [productName, setProductName] = useState(''); // New state for product name
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [originalityCheckOption, setOriginalityCheckOption] = useState('');
  const [qualityCheckOption, setQualityCheckOption] = useState('');
  const [comments, setComments] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [productItself, setProductItself] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showUnownedProductModal, setShowUnownedProductModal] = useState(false);
  const [user, setUser] = useState(null);
  const [qualityScore, setQualityScore] = useState('');

  const image_uuid = uuidv4();

  useEffect(() => {
    const getCurrentUser = async () => {
      return await supabase.auth.getSession()
      .then((user, error) => {
         console.log("Got the session:");
         console.log(user.data.session.user, error);
         const currentUser = user.data.session.user;
         setUser(currentUser);
        });
    };
    getCurrentUser();
  }, []);

  const { barcodeType, barcodeData } = route.params || {};

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      console.log('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        setSelectedImage(pickerResult.assets[0]);
      }
    }
  };

  useEffect(() => {
    if (barcodeData) {
      const fetchDataFromSupabase = async () => {
        try {
          // Fetch product data
          let { data: Product, error: productError } = await supabase
            .from('Product')
            .select('company_id')
            .eq('product_did', barcodeData);
          
          let { data: productName, error: productNameError } = await supabase
            .from('Product')
            .select('product_name')
            .eq('product_did', barcodeData);

          let { data: product, error: productFetchError } = await supabase
            .from('Product')
            .select()
            .eq('product_did', barcodeData);
            
          product = product[0];
          setProductItself(product)
          console.log("PRODUCT, USER", product, user)

          if(product.current_owner == null){
            console.log("current owner is null. updating...");
            const ret = await supabase.from("Product")
            .update({ current_owner: (user ? user.id : null) })
            .eq('product_did', product.product_did);
            console.log(ret);
          }
          else if (product.current_owner == (user ? user.id : null)){
            console.log("The product is mine.");
            setShowUnownedProductModal(false)
          }
          else {  // the product does not belong to you.
            console.log("The product is not mine.");
            console.log("Waiting for user.");
            setTimeout(() => {
              if (product.current_owner == (user ? user.id : null))
                setShowUnownedProductModal(true);
            }, 1000);
          }

          //if (productName.length > 0){
            //setProductName(Product[0].product_did);
          //}

          if (productError) {
            console.error('Error fetching product data from Supabase:', productError.message);
            return;
          }

          if (Product.length > 0) {
            setData(Product);
            setProductName(productName[0].product_name);

            // Fetch company name using company_id
            let { data: Company, error: companyError } = await supabase
              .from('Company')
              .select('company_name')
              .eq('company_id', Product[0].company_id);

            if (companyError) {
              console.error('Error fetching company data from Supabase:', companyError.message);
              return;
            }

            if (Company.length > 0) {
              setCompanyName(Company[0].company_name);
            }
          }

          // Check for existing feedback
          let { data: Feedback, error: feedbackError } = await supabase
            .from('Feedback')
            .select('product_did')
            .eq('product_did', barcodeData);

          if (feedbackError) {
            console.error('Error fetching feedback data from Supabase:', feedbackError.message);
            return;
          }

          if (Feedback.length > 0) {
            setShowWarning(true);
          }
        } catch (error) {
          console.error('Error fetching data from Supabase:', error.message);
        }
      };

      fetchDataFromSupabase();
    }
  }, [barcodeData, user]);

  useEffect(() => {
    console.log("Feedback Category changed.");
    console.log(feedbackCategory, typeof feedbackCategory, feedbackCategory === "originalityCheck", feedbackCategory == "originalityCheck");
  }, [feedbackCategory]);

  const handleSendFeedback = async () => {
    if (!barcodeData) {
      console.error('Error: barcodeData is missing');
      return;
    }

    try {
      const feedbackImage = selectedImage ? image_uuid : null;
      let isFakeValue = null; // Default value for is_fake
      // Determine the value of is_fake based on the originality check option
      if (feedbackCategory === 'originalityCheck') {
        if (originalityCheckOption === 'original') {
          isFakeValue = false; // Set is_fake to false if originality is confirmed
        } else if (originalityCheckOption === 'notOriginal') {
          isFakeValue = true; // Set is_fake to true if not original
        }
      }
      const { data: Feedback, error: insertError } = await supabase
        .from('Feedback')
        .insert([
          {
            company_id: data[0].company_id,
            feedback_customer_text: comments,
            product_did: barcodeData,
            feedback_type: (feedbackCategory === "originalityCheck") ? 1 : 2,
            customer_email: user.email,
            feedback_image: feedbackImage,
            feedback_score: feedbackCategory === 'qualityCheck' ? qualityScore : null, // Pass quality score if feedback category is qualityCheck
            is_fake: isFakeValue, // Include the value of is_fake based on originality check option
          },
        ]);

      if (insertError) {
        throw insertError;
      }

      if (selectedImage) {
        const blob = await fetch(selectedImage.uri).then((res) => res.arrayBuffer());

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images')
          .upload(user.id + "/" + image_uuid, blob, {
            contentType: selectedImage.mimeType ?? "image/jpeg",
          });
        if (uploadError) {
          console.log("uploaderror");
          throw uploadError;
        }
      }

      setShowBanner(true);
      setTimeout(() => {
        console.log("Feedback sending successful.");
        console.log("Routing to navigation in 3 seconds.");
        navigation.navigate('MainMenu');
        setShowBanner(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending feedback:', error.message);
      navigation.navigate('MainMenu');
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#00001b',
      },
      headerTintColor: '#ffffff',
      headerShadowVisible: false,
    });
  }, [navigation]);

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}>
      <StatusBar backgroundColor="#00001B" barStyle="light-content" />

      <Modal 
        animationType='slide'
        transparent= {true}
        visible = {showUnownedProductModal}
        onRequestClose={() => {
          setShowUnownedProductModal(!showUnownedProductModal)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTextRed}>BEWARE</Text>
            <Text style={styles.modalText}>This product currently does not belong to you. Any feedback you give will be visible to other users.</Text>
            <Pressable
              style={[styles.button2, styles.buttonClose]}
              onPress={() => setShowUnownedProductModal(!showUnownedProductModal)}>
              <Text style={styles.textStyle}>Understood</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      

      {showWarning && (
        <Text style={styles.warningText}>Important Note: This item has been given feedback to before. <Text style={{color: "#13e8dd"}} onPress={ () => navigation.navigate("PreviousFeedbacksOfProduct", { product: productItself })}> Click here to see them. </Text></Text>
      )}

      <Text style={styles.title}>Customer Feedback</Text>
      {companyName && (
        <TextInput
          style={styles.input3}
          placeholder="Company Name"
          value={`Company Name: ${companyName}`}// Display company name
          placeholderTextColor="#a6b8ca"
          editable={false}
        />
      )}

      <TextInput
        style={styles.input4}
        placeholder="Product ID"
        value={`Product Name: ${productName}`}
        placeholderTextColor="#a6b8ca"
        editable={false}
      />

      <Picker
        style={styles.input}
        selectedValue={feedbackCategory}
        onValueChange={(value) => setFeedbackCategory(value)}
        dropdownIconColor="#fff"
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
            dropdownIconColor="#fff"
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
            selectedValue={qualityScore}
            //onValueChange={(value) => setQualityCheckOption(value)}
            onValueChange={(value) => setQualityScore(value)}
            dropdownIconColor="#fff"
          >
            <Picker.Item label="Give points to the quality" value="" />
            {[...Array(11).keys()].map((point) => (
              <Picker.Item key={point} label={point.toString()} value={point.toString()} />
            ))}
          </Picker>

          <TextInput
            style={styles.input2}
            placeholder="Feedback Details Here"
            onChangeText={setComments}
            value={comments}
            multiline
            numberOfLines={4}
            placeholderTextColor="#a6b8ca"
          />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={{ width: 200, height: 200 }} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
        <Text style={styles.buttonText}>Send Feedback</Text>
      </TouchableOpacity>

      {showBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Your feedback is submitted</Text>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#00001B',
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    borderBottomColor: '#fff',
    padding: 10,

  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#35a7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  input2: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#00001B',
    borderTopColor: '#fff',
  },
  input3: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    color: '#fff',
    borderTopWidth: 1,
    backgroundColor: '#00001B',
    borderBottomColor: '#fff',
    borderTopColor: '#999',
    fontSize: 14,
    fontWeight: 'bold',

  },
  input4: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#00001B',
    borderBottomColor: '#fff',
    borderTopColor: '#aaa',
    fontSize: 14,
    fontWeight: 'bold',

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
  warningText: {
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: '#333',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button2: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  modalTextRed: {
    marginBottom: 15,
    textAlign: 'center',
    color: "red"
  }
});

export default FeedbackScreen;
