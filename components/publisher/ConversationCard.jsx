import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


export default function ConversationCard({
  conversation,
  onPress,
}) {

  return (

    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >

      <View style={styles.avatar}>

        <Ionicons
          name="person"
          size={24}
          color="#2563EB"
        />

      </View>


      <View style={styles.content}>

        <Text style={styles.name}>
          {conversation.name}
        </Text>


        <Text
          style={styles.message}
          numberOfLines={1}
        >
          {conversation.lastMessage}
        </Text>


        <Text style={styles.property}>
          {conversation.property}
        </Text>

      </View>


      <View>

        <Text style={styles.time}>
          {conversation.time}
        </Text>

        {
          conversation.unread > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {conversation.unread}
              </Text>
            </View>
          )
        }

      </View>


    </TouchableOpacity>

  );
}


const styles = StyleSheet.create({

  card:{
    flexDirection:"row",
    alignItems:"center",
    backgroundColor:"#FFFFFF",
    padding:16,
    borderRadius:18,
    marginBottom:15,
    elevation:3,
  },


  avatar:{
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:"#DBEAFE",
    justifyContent:"center",
    alignItems:"center",
  },


  content:{
    flex:1,
    marginLeft:15,
  },


  name:{
    fontSize:17,
    fontWeight:"700",
    color:"#111827",
  },


  message:{
    marginTop:5,
    color:"#6B7280",
  },


  property:{
    marginTop:4,
    fontSize:12,
    color:"#2563EB",
  },


  time:{
    color:"#9CA3AF",
    fontSize:12,
  },


  badge:{
    marginTop:8,
    backgroundColor:"#2563EB",
    width:22,
    height:22,
    borderRadius:11,
    justifyContent:"center",
    alignItems:"center",
  },


  badgeText:{
    color:"#FFFFFF",
    fontSize:12,
    fontWeight:"700",
  },

});