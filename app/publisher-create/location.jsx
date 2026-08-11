import {
  ScrollView,
  StyleSheet,
} from "react-native";

import { useState } from "react";
import { router } from "expo-router";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormInput from "../../components/forms/FormInput";
import FormButton from "../../components/forms/FormButton";


export default function Location() {

  const [form, setForm] = useState({
    region: "",
    city: "",
    district: "",
    address: "",
  });


  function handleChange(key, value) {

    setForm((prev)=>({
      ...prev,
      [key]:value,
    }));

  }


  function handleNext(){

    console.log("Localisation :", form);

    router.push("/publisher-create/features");

  }


  return (

    <ScrollView

      style={styles.container}

      contentContainerStyle={styles.content}

      showsVerticalScrollIndicator={false}

    >


      <Header
        title="Localisation"
        showBack
      />



      <FormSection title="Adresse du logement">


        <FormInput
          label="Région"
          placeholder="Ex: Dakar"
          value={form.region}
          onChangeText={(text)=>
            handleChange("region",text)
          }
        />


        <FormInput
          label="Ville"
          placeholder="Ex: Dakar"
          value={form.city}
          onChangeText={(text)=>
            handleChange("city",text)
          }
        />



        <FormInput
          label="Quartier"
          placeholder="Ex: Almadies"
          value={form.district}
          onChangeText={(text)=>
            handleChange("district",text)
          }
        />



        <FormInput
          label="Adresse précise"
          placeholder="Rue, numéro..."
          value={form.address}
          onChangeText={(text)=>
            handleChange("address",text)
          }
        />


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


});