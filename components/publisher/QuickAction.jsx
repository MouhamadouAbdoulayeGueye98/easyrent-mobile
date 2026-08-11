import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


export default function QuickAction({
  title,
  icon,
  color,
  onPress,
}) {

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >

      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: color + "20",
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={30}
          color={color}
        />

      </View>


      <Text style={styles.title}>
        {title}
      </Text>


    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({

  card:{
    width:"48%",
    backgroundColor:"#FFFFFF",
    padding:20,
    borderRadius:18,
    marginBottom:15,
    alignItems:"center",
  },


  iconContainer:{
    width:60,
    height:60,
    borderRadius:30,
    justifyContent:"center",
    alignItems:"center",
  },


  title:{
    marginTop:12,
    textAlign:"center",
    fontSize:15,
    fontWeight:"600",
    color:"#111827",
  },

});