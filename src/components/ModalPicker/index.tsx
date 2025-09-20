import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from "react-native";
import { CategoryProps } from "../../pages/Order";

interface ModalPickerProps {
  options:          CategoryProps[] | undefined;
  selectedItem:     ( item: CategoryProps ) => void;
  handleCloseModal: () => void;
};

const {width: WIDTH, height: HEIGHT} = Dimensions.get("window");

export function ModalPicker({options, handleCloseModal, selectedItem}: ModalPickerProps){
  
  function onPressItem(item: CategoryProps){
    selectedItem(item);
    handleCloseModal();
  };

  const option = options?.map((item, index) => (
    <TouchableOpacity key={index} style={styles.option} onPress={() => onPressItem(item)}>
      <Text style={styles.item}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  ))

  return(
    <TouchableOpacity
      onPress={handleCloseModal}
      style={styles.container}
    >
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {option}
        </ScrollView>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: WIDTH - 20,
    height: HEIGHT / 2,
    backgroundColor: "#2a2a40",
    borderWidth: 1,
    borderColor: "#8a8a8a",
    borderRadius: 5,
  },
  option:{
    alignItems: "center",
    borderTopWidth: 0.8,
    borderTopColor: "#8a8a8a",
  },
  item: {
    margin: 14,
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});