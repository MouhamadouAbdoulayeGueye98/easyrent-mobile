import {
  ScrollView,
  StyleSheet,
  Switch,
  View,
  Text,
} from "react-native";

import { useState } from "react";

import Header from "../../../components/common/Header";
import ProfileMenuItem from "../../../components/publisher/ProfileMenuItem";


export default function Settings(){

  const [notifications,setNotifications] = useState(true);


  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      <Header
        title="Paramètres"
        showBack
      />


      <View style={styles.card}>

        <Text style={styles.title}>
          Notifications
        </Text>


        <View style={styles.row}>

          <View>

            <Text style={styles.label}>
              Recevoir les notifications
            </Text>

            <Text style={styles.subtitle}>
              Nouvelles demandes et messages
            </Text>

          </View>


          <Switch
            value={notifications}
            onValueChange={setNotifications}
          />

        </View>

      </View>


      <ProfileMenuItem
        icon="lock-closed-outline"
        color="#8B5CF6"
        title="Sécurité"
        subtitle="Mot de passe et connexion"
      />


      <ProfileMenuItem
        icon="language-outline"
        color="#10B981"
        title="Langue"
        subtitle="Français"
      />


      <ProfileMenuItem
        icon="help-circle-outline"
        color="#F59E0B"
        title="Centre d'aide"
      />


      <ProfileMenuItem
        icon="document-text-outline"
        color="#6B7280"
        title="Conditions d'utilisation"
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
},


card:{
backgroundColor:"#FFFFFF",
padding:18,
borderRadius:18,
marginBottom:20,
},


title:{
fontSize:18,
fontWeight:"700",
color:"#111827",
marginBottom:15,
},


row:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
},


label:{
fontSize:16,
fontWeight:"600",
color:"#111827",
},


subtitle:{
fontSize:13,
color:"#6B7280",
marginTop:4,
},

});