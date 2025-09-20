import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";

import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { api } from "../../services/api";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";


type RouterDetailParams = {
  FinishOrder: {
    number:    number | string;
    order_id:  string;
  };  
};

type FinishOrderRouteProps = RouteProp<RouterDetailParams, 'FinishOrder'>;

export default function FinishOrder(){
  const route = useRoute<FinishOrderRouteProps>();
  const navigate = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  async function handleFinish(){
    try{
      await api.patch("/order/finished", {
        order_id: route.params.order_id,
      });

      navigate.popToTop();

    }catch(err){
      console.error(err);
      alert("Algo deu errado!");
    }
  }

  return(
    <View style={styles.container}>
      <Text style={styles.alert}>Você deseja finalizar esse pedido?</Text>
      <Text style={styles.title}>Mesa {route.params.number}</Text>

      <TouchableOpacity onPress={handleFinish} style={styles.button}>
        <Text style={styles.textButton}>Finalizar pedido</Text>
        <Feather name="shopping-cart" size={20} color="#1d1d2e"/>
      </TouchableOpacity>
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    paddingHorizontal: "5%",
    paddingVertical: "5%",
    alignItems: "center",
    justifyContent: "center",
  },
  alert:{
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
    marginBottom: 12,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#3fffa3",
    flexDirection: "row",
    width: "65%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  textButton: {
    fontSize: 18,
    marginRight: 8,
    fontWeight: "bold",
    color: "#1d1d2e",
  }
})