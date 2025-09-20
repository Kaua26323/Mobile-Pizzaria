import React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { api } from "../../services/api";

interface ItemProps {
  data: {
    id:         string;
    name:       string;
    product_id: string;
    amount:     string | number;
  };
  deleteItem:   (item_id: string) => void;
}

export function ListItems({data, deleteItem}: ItemProps){




  async function handleDeleteItem(){
    deleteItem(data.id);
  };

  return( 
    <View style={styles.container}>
      <Text style={styles.item}> {data.amount} - {data.name} </Text>
      <TouchableOpacity onPress={handleDeleteItem}>
        <Feather name="trash-2" size={25} color="#FF3F4b"/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#101026",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
    borderWidth: 0.3,
    borderColor: "#8a8a8a",
  },
  item: {
    color: "#FFF"
  }
});