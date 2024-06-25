 // ben verdim
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
  Pressable,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker'; // Import expo-image-picker
import supabase from './supabase'; // Import supabase client
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import { useSupabase } from './supabase'; // Import Supabase context or hook


const Delivery1 = ({ route, navigation }) => {
  const [data, setData] = useState('');
  const [comments, setComments] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // State to store selected image
  const [showBanner, setShowBanner] = useState(false); // State for banner visibility
  const [user, setUser] = useState(null);
  const [companyName, setCompanyName] = useState(''); // New state for company name
  const [productName, setProductName] = useState(''); // New state for product name
  const [showUnownedProductModal, setShowUnownedProductModal] = useState(false);
  const [productItself, setProductItself] = useState(null);

  const image_uuid = uuidv4();

  //placing getCurrentUser inside an empty-dependency-array useEffect so that it executes only once.
  useEffect(() => {
    const getCurrentUser = async() => {
    return await supabase.auth.getSession()
            .then((data, error) => {
               console.log("Got the session at Delivery1:");
               console.log(data.data.session.user, error);
               currentUser = data.data.session.user
               setUser(data.data.session.user)
              });

    }
    getCurrentUser();
  }, []);

  useEffect(() => {
    if(user && barcodeData){
      const checkForOwnership = async() => {
        let { data: product, error: productFetchError } = await supabase
              .from('Product')
              .select()
              .eq('product_did', barcodeData);
        if(product){
          product = product[0]
          console.log("product, user", product, user)
          if (product.current_owner != user.id){
              console.log("The product is not mine.");
              setShowUnownedProductModal(true)
          }
          setProductItself(product)
        }
      }
      checkForOwnership().catch(console.error)
    }
  }, [user, barcodeData])

  // Check if route.params exists and has the required properties
  const { barcodeType, barcodeData } = route.params || {};
  // Function to handle image selection
  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      console.log('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync();
    if (!pickerResult.canceled) {
      // Access selected assets through the "assets" array
      if (pickerResult.assets && pickerResult.assets.length > 0) {
        setSelectedImage(pickerResult.assets[0]);
      }
    }
  };


  useEffect(() => {
    if (barcodeData) {
      const fetchDataFromSupabase = async () => {
        try {
          let { data: Feedback, error } = await supabase
            .from('Product')
            .select('company_id')
            .eq('product_did', barcodeData);

          let { data: productName, error: productNameError } = await supabase
            .from('Product')
            .select('product_name')
            .eq('product_did', barcodeData);
            
          if (error) {
            console.error('Error fetching data from Supabase:', error.message);
            return;
          }

          if (Feedback.length > 0) {
            setData(Feedback);
            setProductName(productName[0].product_name);

            // Fetch company name using company_id
            let { data: Company, error: companyError } = await supabase
              .from('Company')
              .select('company_name')
              .eq('company_id', Feedback[0].company_id);

            if (companyError) {
              console.error('Error fetching company data from Supabase:', companyError.message);
              return;
            }

            if (Company.length > 0) {
              setCompanyName(Company[0].company_name);
            }
          }
        } catch (error) {
          console.error('Error fetching data from Supabase:', error.message);
        }
      };

      fetchDataFromSupabase();
      
    }
  }, [barcodeData]);

  // checking values of feedbackCategory

  const handleSendFeedback = async () => {
    /*if (!barcodeData || !selectedImage) {
      console.error('Error: barcodeData or selectedImage is missing');
      return;
    }*/

    try {
      // 1 originality, 2 quality
      const feedbackImage = selectedImage ? image_uuid : null;

      const { data: Feedback, error: insertError } = await supabase
        .from('Supply_Chain')
        .insert([
          {
            company_id: data[0].company_id,
            comment: comments,
            product_did: barcodeData,
            email: user.email,
            delivery_image: feedbackImage,
            delivery_type: "1"
          },
        ]);

      if (insertError) {
        throw insertError;
      }
      if (selectedImage){
      const blob = await fetch(selectedImage.uri).then((res) => res.arrayBuffer());
      //console.log(selectedImage, selectedImage.uri)
      //console.log("userid ", user.id);
      //console.log("uuidv4 ", image_uuid);
      //console.log("product did: ", barcodeData);

      // Upload the image file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images_delivery')
        .upload(user.id + "/" + image_uuid, blob, {
          contentType: selectedImage.mimeType ?? "image/jpeg",
        });
      if (uploadError) {
        console.log("uploaderror")
        throw uploadError;
      }
    }
        const ret = await supabase.from("Product")
            .update({ current_owner: null })
            .eq('product_did', productItself.product_did);
      // show banner to visualize submission status
      setShowBanner(true);
      setTimeout(() => {
        console.log("Delivery sending successful.")
        console.log("Routing to navigation in 3 seconds.")
        navigation.navigate('MainMenu');
        setShowBanner(false)
      }, 3000 
    );
    } 
    catch (error) {
      console.error('Error sending feedback:', error.message);
      navigation.navigate('MainMenu');
    }
  };


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#35a7ff',
      },
      headerTintColor: '#000',
      headerShadowVisible: false,
    });
  }, [navigation]);

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container}> 
      <StatusBar backgroundColor="#35a7ff" barStyle="light-content" />

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
            <Text style={styles.modalTextRed}>ERROR!</Text>
            <Text style={styles.modalText}>This product currently does not belong to you. You can not relieve the ownership of it.</Text>
            <Pressable
              style={[styles.button2, styles.buttonClose]}
              onPress={() => navigation.navigate("MainMenu")}>
              <Text style={styles.textStyle}>Oops, go back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Text style={styles.title}>Product Delivery Confirmation</Text>
      {data && (
        <TextInput
          style={styles.input}
          placeholder="Company ID"
          value={`Company Name: ${companyName}`}// Display company name
          placeholderTextColor="#a6b8ca"
          editable={false}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Product ID"
        value={`Product Name: ${productName}`}
        placeholderTextColor="#a6b8ca"
        editable={false}
      />


      <TextInput
            style={styles.input2}
            placeholder="Write Any Delivery Details Here"
            onChangeText={setComments}
            value={comments}
            multiline
            numberOfLines={3}
            placeholderTextColor="#444"
          />
      {/* Image picker */}
      <TouchableOpacity style={styles.button} onPress={selectImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>

      {/* Selected image preview */}
      {selectedImage && (
        <Image source={{ uri: selectedImage.uri }} style={{ width: 200, height: 200 }} />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
        <Text style={styles.buttonText}>I have delivered</Text>
      </TouchableOpacity>

      {/* Banner */}
      {showBanner && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Your delivery is submitted</Text>
        </View>
      )}
      
    </KeyboardAwareScrollView>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#35a7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  input2: {
    width: '80%',
    padding: 10,
    marginBottom: 10,
    color: '#000',
    backgroundColor: '#35a7ff',
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  button: {
    backgroundColor: '#00001B',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
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
    color: '#000',
    fontWeight: 'bold',
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
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: "red"
  }
});

export default Delivery1;
