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


export default function Pricing() {

  const [form, setForm] = useState({
    price: "",
    charges: "",
    deposit: "",
    availability: "",
  });


  function handleChange(key, value) {

    setForm((prev)=>({
      ...prev,
      [key]: value,
    }));

  }


  function handleNext(){

    console.log("Prix :", form);

    router.push("/publisher-create/photos");

  }


  return (

    <ScrollView

      style={styles.container}

      contentContainerStyle={styles.content}

      showsVerticalScrollIndicator={false}

    >


      <Header
        title="Prix et disponibilité"
        showBack
      />



      <FormSection title="Informations financières">


        <FormInput
          label="Prix"
          placeholder="Ex: 250000 FCFA / mois"
          keyboardType="numeric"
          value={form.price}
          onChangeText={(text)=>
            handleChange("price", text)
          }
        />



        <FormInput
          label="Charges (optionnel)"
          placeholder="Ex: 15000 FCFA"
          keyboardType="numeric"
          value={form.charges}
          onChangeText={(text)=>
            handleChange("charges", text)
          }
        />



        <FormInput
          label="Caution"
          placeholder="Ex: 2 mois"
          value={form.deposit}
          onChangeText={(text)=>
            handleChange("deposit", text)
          }
        />



        <FormInput
          label="Disponibilité"
          placeholder="Ex: Disponible immédiatement"
          value={form.availability}
          onChangeText={(text)=>
            handleChange("availability", text)
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