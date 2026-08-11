import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


export default function StatCard({
  title,
  value,
  icon,
  color,
}) {

  return (

    <View style={styles.card}>


      <View
        style={[
          styles.iconBox,
          {
            backgroundColor: color + "20",
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={28}
          color={color}
        />

      </View>


      <Text style={styles.value}>
        {value}
      </Text>


      <Text style={styles.title}>
        {title}
      </Text>


    </View>

  );
}


const styles = StyleSheet.create({

  card:{
    width:"48%",
    backgroundColor:"#FFFFFF",
    padding:18,
    borderRadius:18,
    marginBottom:15,
  },


  iconBox:{
    width:50,
    height:50,
    borderRadius:25,
    justifyContent:"center",
    alignItems:"center",
  },


  value:{
    marginTop:15,
    fontSize:26,
    fontWeight:"700",
    color:"#111827",
  },


  title:{
    marginTop:5,
    color:"#6B7280",
  },

});