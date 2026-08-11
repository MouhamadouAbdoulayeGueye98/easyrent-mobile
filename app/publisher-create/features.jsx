import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";


export default function Features() {

  const [form, setForm] = useState({
    bedrooms: 0,
    bathrooms: 0,
    area: "",
    furnished: false,
  });


  function updateNumber(key, value) {

    setForm((prev)=>({
      ...prev,
      [key]: Math.max(0, prev[key] + value),
    }));

  }


  function handleChange(key,value){

    setForm((prev)=>({
      ...prev,
      [key]:value,
    }));

  }


  function handleNext(){

    console.log("Caractéristiques :", form);

    router.push("/publisher-create/pricing");

  }


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >


      <Header
        title="Caractéristiques"
        showBack
      />



      <FormSection title="Informations du logement">


        <View style={styles.counterContainer}>

          <Text style={styles.label}>
            Chambres
          </Text>


          <View style={styles.counter}>


            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                updateNumber("bedrooms",-1)
              }
            >
              <Text style={styles.buttonText}>
                -
              </Text>
            </TouchableOpacity>


            <Text style={styles.value}>
              {form.bedrooms}
            </Text>


            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                updateNumber("bedrooms",1)
              }
            >
              <Text style={styles.buttonText}>
                +
              </Text>
            </TouchableOpacity>


          </View>

        </View>




        <View style={styles.counterContainer}>

          <Text style={styles.label}>
            Salles de bain
          </Text>


          <View style={styles.counter}>


            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                updateNumber("bathrooms",-1)
              }
            >
              <Text style={styles.buttonText}>
                -
              </Text>
            </TouchableOpacity>



            <Text style={styles.value}>
              {form.bathrooms}
            </Text>



            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                updateNumber("bathrooms",1)
              }
            >
              <Text style={styles.buttonText}>
                +
              </Text>
            </TouchableOpacity>


          </View>

        </View>



        <FormInput

          label="Surface (m²)"

          placeholder="Ex: 120"

          keyboardType="numeric"

          value={form.area}

          onChangeText={(text)=>
            handleChange("area",text)
          }

        />



        <TouchableOpacity
          style={[
            styles.furnished,
            form.furnished && styles.furnishedActive
          ]}

          onPress={() =>
            handleChange(
              "furnished",
              !form.furnished
            )
          }

        >

          <Text>
            {form.furnished
              ? "✓ Logement meublé"
              : "Logement non meublé"
            }
          </Text>

        </TouchableOpacity>


      </FormSection>



      <FormButton
        title="Suivant"
        onPress={handleNext}
      />


    </ScrollView>

  );

}



const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F8FAFC",
  },


  content:{
    padding:20,
    paddingBottom:40,
  },


  counterContainer:{
    marginBottom:20,
  },


  label:{
    fontSize:15,
    fontWeight:"600",
    marginBottom:10,
    color:"#111827",
  },


  counter:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    gap:25,
  },


  button:{
    width:45,
    height:45,
    borderRadius:23,
    backgroundColor:"#2563EB",
    justifyContent:"center",
    alignItems:"center",
  },


  buttonText:{
    color:"#FFFFFF",
    fontSize:25,
    fontWeight:"700",
  },


  value:{
    fontSize:22,
    fontWeight:"700",
  },


  furnished:{
    padding:15,
    borderRadius:12,
    backgroundColor:"#E5E7EB",
    alignItems:"center",
  },


  furnishedActive:{
    backgroundColor:"#D1FAE5",
  },

});