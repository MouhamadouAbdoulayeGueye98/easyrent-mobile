import {
  View,
  FlatList,
  StyleSheet,
} from "react-native";

import Header from "../../components/common/Header";
import RequestCard from "../../components/publisher/RequestCard";


const requests = [
  {
    id:"1",
    user:"Moussa Ndiaye",
    property:"Appartement F4 Almadies",
    date:"Samedi 27 Juillet",
    time:"15:30",
    message:"Je souhaite visiter le logement.",
    status:"pending",
  },

  {
    id:"2",
    user:"Fatou Diop",
    property:"Studio moderne Ouakam",
    date:"Lundi 29 Juillet",
    time:"10:00",
    message:"Le logement est-il toujours disponible ?",
    status:"accepted",
  },
];


export default function Requests(){


  return (

    <View style={styles.container}>

      <Header
        title="Demandes de visite"
      />


      <FlatList

        data={requests}

        keyExtractor={(item)=>item.id}

        renderItem={({item})=>(

          <RequestCard

            request={item}

            onAccept={()=>
              console.log("Acceptée",item.id)
            }

            onReject={()=>
              console.log("Refusée",item.id)
            }

          />

        )}

        contentContainerStyle={styles.list}

        showsVerticalScrollIndicator={false}

      />


    </View>

  );

}



const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F8FAFC",
  },


  list:{
    padding:20,
    paddingBottom:40,
  },

});