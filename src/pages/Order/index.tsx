import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { api } from "../../services/api";
import { ModalPicker } from "../../components/ModalPicker";
import { ListItems } from "../../components/ListItems";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamsList } from "../../routes/app.routes";

type RouterDetailParams = {
  Order: {
    order_id: string;
    number:   string | number;
  }
};

export type CategoryProps =  {
  id:   string;
  name: string;
};

type ProductProps = {
  id:   string;
  name: string;
};

type ItemsProps = {
  id:         string;
  name:       string;
  product_id: string;
  amount:     string | number;
}

type OrderRouteProps = RouteProp<RouterDetailParams, 'Order'>;

export default function Order(){
  const route = useRoute<OrderRouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

  const [category, setCategory] = useState<CategoryProps[] | []>([]);
  const [categorySelected, setCategorySelected] = useState<CategoryProps | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);

  const [products, setProducts] = useState<ProductProps[] | []>([]);
  const [productSelected, setProductSelected] = useState<ProductProps | undefined>();
  const [showModalProduct, setShowModalProduct] =  useState<boolean>(false);

  const [items, setItems] = useState<ItemsProps[] | []>([]);

  const [amount, setAmount] = useState("1");

  useEffect(() => {
    async function loadInfo(){
      try{
        const response = await api.get("/categoryInfo");
        setCategory(response.data);
        setCategorySelected(response.data[0]);
      }catch(err){
        console.error(err);
        alert(`Algo deu errado! Erro: ${err}`);
      }
    }
    loadInfo();

  }, []);

  useEffect(() => {
    async function fetchProducts(){
      try{
        const response = await api.get("/category/product",{
          params:{
            category_id: categorySelected?.id,
          }
        });
        setProducts(response.data);
        setProductSelected(response.data[0]);

      }catch(err){
        console.log(err);
        alert("Algo deu errado!");
      };
    };

    fetchProducts()

  }, [categorySelected]);


  async function handleCloseOrder(){
    try{
      await api.delete("/delete-order", {
        params: {
          order_id: route.params?.order_id,
        }
      });

      navigation.goBack();

    }catch(err){
      console.error(err);
      alert("Algo deu errado");
    };
  };

  async function handleAddItem(){
    try{  
      const response = await api.post("/order/add-item",{
        order_id: route.params.order_id,
        product_id: productSelected?.id,
        amount: Number(amount)
      });

      let data = {
        id: response.data.id,
        name: productSelected?.name as string,
        product_id: productSelected?.id as string,
        amount: amount,
      };

      setItems(oldArray => [...oldArray, data]);
      
    }catch(err){
      console.log(err);
      alert("Algo deu errado!");
    };
  };

  async function handleDeleteItem(item_id: string){
    try{
      await api.delete("/order/delete-Item", {
        params: {
          item_id: item_id,
        }
      });

      let removeItem = items.filter(item => {
        return (item.id !== item_id);
      });

      setItems(removeItem);
      alert("funcionou");

    }catch(err){
      console.log(err);
      alert("Algo deu errado!");
    };
  };

  function handleFinishOrder(){
    navigation.navigate("FinishOrder", {
      number: route.params.number,
      order_id: route.params.order_id
    });
  };

  return(
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Mesa {route.params.number}</Text>
        {items.length === 0 && (
          <TouchableOpacity onPress={handleCloseOrder}>
            <Feather name="trash-2" size={28} color="#FF3F4b"/>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowModal(true)}
      >
        <Text style={{color: "#FFF"}}>{categorySelected?.name}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowModalProduct(true)}
      >
        <Text style={{color: "#FFF"}}>{productSelected?.name}</Text>
      </TouchableOpacity>

      <View style={styles.qtdContainer}>
        <Text style={styles.qtdText}>Quantidade</Text>
        <TextInput 
          style={[styles.input, {width: "60%", textAlign: "center"}]}
          placeholderTextColor="#F0F0F0"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={handleAddItem}
          style={styles.buttonAdd} 
        >
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFinishOrder}
          style={[ styles.button, { opacity: items.length === 0 ? 0.3 : 1 } ]}
          disabled={items.length === 0}
        >
          <Text style={styles.buttonText} >Avançar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex:1, marginTop: 24 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ListItems data={item} deleteItem={handleDeleteItem}/>}
      />

      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
      >
        <ModalPicker
          handleCloseModal={() => setShowModal(false) }
          options={category}
          selectedItem={(item) => setCategorySelected(item)}
        />
      </Modal>
      <Modal
        transparent={true}
        visible={showModalProduct}
        animationType="slide"
      >
        <ModalPicker
          handleCloseModal={() => setShowModalProduct(false)}
          options={products}
          selectedItem={(item) => setProductSelected(item)}
        />

      </Modal>
    </View>
  )

}


const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#1d1d2e",
    paddingVertical: "5%",
    paddingEnd: "5%",
    paddingStart: "5%",
  },
  header:{
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    marginTop: 24,
  },
  title:{
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    marginRight: 14,
  },
  input: {
    backgroundColor: "#101026",
    borderRadius: 5,
    width: "100%",
    height: 40,
    marginBottom: 12,
    paddingHorizontal: 8,
    justifyContent: "center",
    color: "#FFF",
    fontSize: 18
  },
  qtdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  qtdText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#fff",
  },
  actions: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  buttonAdd: {
    width: "20%",
    backgroundColor: "#3fd1ff",
    borderRadius: 5,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#101026",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3fffa3",
    borderRadius: 5,
    height: 40,
    width: "75%",
    justifyContent: "center",
    alignItems: "center"
  },
});
