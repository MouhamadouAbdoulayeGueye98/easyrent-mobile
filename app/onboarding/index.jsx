import {
  FlatList,
  Dimensions,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

import OnboardingItem from "../../components/ui/OnboardingItem";
import Paginator from "../../components/ui/Paginator";
import { onboardingData } from "../../constants/onboarding";
import { COLORS } from "../../constants/colors";


const { width } = Dimensions.get("window");


export default function Onboarding() {

  const [currentIndex, setCurrentIndex] = useState(0);

  const slidesRef = useRef(null);


  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if(viewableItems.length > 0){
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;


  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;



  const nextSlide = () => {

    if(currentIndex < onboardingData.length - 1){

      slidesRef.current.scrollToIndex({
        index: currentIndex + 1,
      });

    }else{

      completeOnboarding();

    }

  };



  const skip = () => {
    completeOnboarding();
  };



  const completeOnboarding = async () => {

    try {

      await AsyncStorage.setItem(
        "hasSeenOnboarding",
        "true"
      );

      router.replace("/auth/login");

    } catch(error){

      console.log(error);

    }

  };



  return (

    <View style={styles.container}>


      <TouchableOpacity
        style={styles.skipButton}
        onPress={skip}
      >

        <Text style={styles.skipText}>
          Passer
        </Text>

      </TouchableOpacity>



      <FlatList

        data={onboardingData}

        renderItem={({item}) => (
          <OnboardingItem
            item={item}
            width={width}
          />
        )}

        horizontal

        showsHorizontalScrollIndicator={false}

        pagingEnabled

        bounces={false}

        keyExtractor={(item)=>item.id}


        ref={slidesRef}

        onViewableItemsChanged={viewableItemsChanged}

        viewabilityConfig={viewConfig}

      />

$

      <Paginator
        data={onboardingData}
        currentIndex={currentIndex}
      />



      <TouchableOpacity
        style={styles.button}
        onPress={nextSlide}
      >

        <Text style={styles.buttonText}>

          {
            currentIndex === onboardingData.length -1
            ? "Commencer"
            : "Suivant"
          }

        </Text>

      </TouchableOpacity>



    </View>

  );
}



const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#fff",
  },


  skipButton:{
    position:"absolute",
    top:50,
    right:25,
    zIndex:10,
  },


  skipText:{
    fontSize:16,
    color:COLORS.gray,
  },


  button:{
    backgroundColor:COLORS.primary,
    marginHorizontal:30,
    marginBottom:40,
    paddingVertical:16,
    borderRadius:12,
    alignItems:"center",
  },


  buttonText:{
    color:"#fff",
    fontSize:18,
    fontWeight:"600",
  }

});