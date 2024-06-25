import React, { useLayoutEffect, useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, FlatList } from 'react-native';
import supabase from './supabase';
import { useNavigation } from '@react-navigation/native';

const PreviousFeedbacks = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [showBanner, setShowBanner] = useState(false); // State for banner visibility
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#00001B' },
      headerTintColor: '#ffffff',
      headerShadowVisible: false,
      title: "Your previous feedbacks"
    });
  }, [navigation]);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (data.session && data.session.user) {
          setUser(data.session.user);
        } else {
          throw new Error("User session is null");
        }
      } catch (error) {
        console.error("Error getting user session:", error);
        setShowBanner(true);
        setTimeout(() => {
          setShowBanner(false);
          navigation.navigate('MainMenu');
        }, 3000);
      }
    };
    getCurrentUser();
  }, [navigation]);

  useEffect(() => {
    if (user) {
      const getUserFeedbacks = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('Feedback')
            .select(`feedback_id, 
                     created_at, 
                     feedback_customer_text, 
                     feedback_company_answer, 
                     Company (company_name),
                     Product (
                      product_name,
                      product_did
                    ), 
                     feedback_type, 
                     feedback_image, 
                     feedback_answered`)
            .eq('customer_email', user.email);
          if (error) throw error;
          setFeedbacks(data);
        } catch (error) {
          console.error("Error fetching feedbacks:", error);
        } finally {
          setLoading(false);
        }
      };
      getUserFeedbacks();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTextStyle}>
        Feedbacks of {user ? user.email : "Waiting on auth..."}:
      </Text>
      <View style={styles.paginationContainer}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={feedbacks.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))}
            keyExtractor={(item) => item.feedback_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.individualFeedbackContainer}>
                <Pressable
                  onPress={() => navigation.navigate("IndividualFeedback", { feedback: item })}
                  onLongPress={() => console.log("long pressed")}
                  style={item.feedback_type == 2 ? styles.individualQualityFeedbackStyle : styles.individualOriginalityFeedbackStyle}
                >
                  <Text numberOfLines={1} style={styles.individualFeedbackText}>{item.Company.company_name || "company name undefined"}</Text>
                  <Text numberOfLines={1} style={styles.individualFeedbackText}>{item.Product.product_name || "product name undefined"}</Text>
                  <Text numberOfLines={1} style={styles.individualFeedbackText}>{item.feedback_customer_text || "text undefined"}</Text>
                  <Text numberOfLines={1} style={[styles.individualFeedbackText, { color: item.feedback_answered ? "#06f90a" : "#ff4627" }]}>
                    {item.feedback_answered ? "Answered" : "Unanswered"}
                  </Text>
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
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
    alignItems: 'left',
    padding: 20,
    backgroundColor: '#00001B',
  },
  individualFeedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'left',
    padding: 15,
    backgroundColor: '#00001B',
    
  },
  individualQualityFeedbackStyle: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 24,
    elevation: 5,
    backgroundColor: '#00001B',
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 1.5,
  },
  individualOriginalityFeedbackStyle: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 24,
    elevation: 5,
    backgroundColor: '#00001B',
    borderRadius: 50,

    borderColor: '#35a7ff',
    borderWidth: 1.5,
  },
  headerTextStyle: {
    fontSize: 20,
    color: "white",
    alignItems: "baseline",
  },
  paginationContainer: {
    flex: 1,
  },
  individualFeedbackText: {
    paddingVertical: 2,
    fontSize: 16,
    color: "white",
  },
  loadingText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
  },
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff4444',
    padding: 10,
  },
  bannerText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default PreviousFeedbacks;
