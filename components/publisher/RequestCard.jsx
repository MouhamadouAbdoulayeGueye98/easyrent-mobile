import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";


export default function RequestCard({
  request,
  onAccept,
  onReject,
}) {

  return (

    <View style={styles.card}>


      <View style={styles.header}>

        <View style={styles.avatar}>
          <Ionicons
            name="person"
            size={24}
            color="#2563EB"
          />
        </View>


        <View style={styles.userInfo}>

          <Text style={styles.name}>
            {request.user}
          </Text>

          <Text style={styles.property}>
            {request.property}
          </Text>

        </View>


        <View
          style={[
            styles.status,
            request.status === "accepted"
              ? styles.accepted
              : request.status === "rejected"
              ? styles.rejected
              : styles.pending,
          ]}
        >

          <Text style={styles.statusText}>
            {request.status === "accepted"
              ? "Acceptée"
              : request.status === "rejected"
              ? "Refusée"
              : "En attente"}
          </Text>

        </View>


      </View>



      <View style={styles.infoRow}>

        <Ionicons
          name="calendar-outline"
          size={20}
          color="#6B7280"
        />

        <Text style={styles.info}>
          {request.date}
        </Text>

      </View>



      <View style={styles.infoRow}>

        <Ionicons
          name="time-outline"
          size={20}
          color="#6B7280"
        />

        <Text style={styles.info}>
          {request.time}
        </Text>

      </View>



      <Text style={styles.message}>
        {request.message}
      </Text>



      {request.status === "pending" && (

        <View style={styles.actions}>


          <TouchableOpacity
            style={styles.acceptButton}
            onPress={onAccept}
          >
            <Text style={styles.acceptText}>
              Accepter
            </Text>
          </TouchableOpacity>



          <TouchableOpacity
            style={styles.rejectButton}
            onPress={onReject}
          >
            <Text style={styles.rejectText}>
              Refuser
            </Text>
          </TouchableOpacity>


        </View>

      )}


    </View>

  );
}



const styles = StyleSheet.create({

  card:{
    backgroundColor:"#FFFFFF",
    borderRadius:18,
    padding:18,
    marginBottom:15,
    elevation:3,
  },


  header:{
    flexDirection:"row",
    alignItems:"center",
  },


  avatar:{
    width:45,
    height:45,
    borderRadius:25,
    backgroundColor:"#DBEAFE",
    justifyContent:"center",
    alignItems:"center",
  },


  userInfo:{
    flex:1,
    marginLeft:12,
  },


  name:{
    fontSize:17,
    fontWeight:"700",
    color:"#111827",
  },


  property:{
    marginTop:3,
    color:"#6B7280",
  },


  status:{
    paddingHorizontal:10,
    paddingVertical:5,
    borderRadius:20,
  },


  pending:{
    backgroundColor:"#FEF3C7",
  },


  accepted:{
    backgroundColor:"#D1FAE5",
  },


  rejected:{
    backgroundColor:"#FEE2E2",
  },


  statusText:{
    fontSize:12,
    fontWeight:"700",
  },


  infoRow:{
    flexDirection:"row",
    alignItems:"center",
    marginTop:15,
  },


  info:{
    marginLeft:10,
    color:"#4B5563",
  },


  message:{
    marginTop:15,
    color:"#374151",
    lineHeight:22,
  },


  actions:{
    flexDirection:"row",
    marginTop:20,
    gap:10,
  },


  acceptButton:{
    flex:1,
    backgroundColor:"#10B981",
    padding:12,
    borderRadius:12,
    alignItems:"center",
  },


  rejectButton:{
    flex:1,
    backgroundColor:"#FEE2E2",
    padding:12,
    borderRadius:12,
    alignItems:"center",
  },


  acceptText:{
    color:"#FFFFFF",
    fontWeight:"700",
  },


  rejectText:{
    color:"#EF4444",
    fontWeight:"700",
  },


});