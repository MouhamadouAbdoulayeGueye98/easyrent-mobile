import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import Header from "../../components/common/Header";
import FormSection from "../../components/forms/FormSection";
import FormButton from "../../components/forms/FormButton";


export default function Photos() {

  const [images, setImages] = useState([]);


  async function pickImages(){

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();


    if(!permission.granted){
      alert("Permission nécessaire pour choisir des images");
      return;
    }


    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes:[
          "images"
        ],

        allowsMultipleSelection:true,

        quality:0.7,

      });



    if(!result.canceled){

      setImages(result.assets);

    }

  }



  function removeImage(index){

    setImages((prev)=>
      prev.filter((_,i)=>i !== index)
    );

  }



  function handlePublish(){

    console.log("Images :", images);

    // plus tard :
    // envoyer vers NestJS / MongoDB

  }



  return (

    <ScrollView

      style={styles.container}

      contentContainerStyle={styles.content}

      showsVerticalScrollIndicator={false}

    >


      <Header
        title="Photos du logement"
        showBack
      />



      <FormSection title="Ajouter des photos">


        <TouchableOpacity

          style={styles.addButton}

          onPress={pickImages}

        >

          <Text style={styles.addText}>
            + Ajouter des photos
          </Text>


        </TouchableOpacity>



        <View style={styles.gallery}>


          {images.map((image,index)=>(

            <TouchableOpacity

              key={index}

              onPress={()=>
                removeImage(index)
              }

            >

              <Image

                source={{
                  uri:image.uri
                }}

                style={styles.image}

              />


            </TouchableOpacity>

          ))}


        </View>


      </FormSection>



      <FormButton

        title="Publier l'annonce"

        onPress={handlePublish}

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


  addButton:{
    height:120,
    borderWidth:2,
    borderColor:"#2563EB",
    borderStyle:"dashed",
    borderRadius:15,
    justifyContent:"center",
    alignItems:"center",
  },


  addText:{
    color:"#2563EB",
    fontSize:16,
    fontWeight:"700",
  },


  gallery:{
    flexDirection:"row",
    flexWrap:"wrap",
    marginTop:20,
    gap:10,
  },


  image:{
    width:100,
    height:100,
    borderRadius:12,
  },


});