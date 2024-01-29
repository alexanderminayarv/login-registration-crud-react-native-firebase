import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./../database/firebase";
import { Input, Icon } from "react-native-elements";

const EditProduct = () => {
  const [productData, setProductData] = useState({});
  const [editedData, setEditedData] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const productDoc = await getDoc(doc(db, "products", productId));
        if (productDoc.exists()) {
          setProductData(productDoc.data());
          setEditedData(productDoc.data());
        } else {
          console.error("El producto no existe.");
        }
      } catch (error) {
        console.error("Error al obtener datos del producto:", error);
      }
    };

    fetchProductData();
  }, [productId]);

  const handleEdit = async () => {
    if (
      !editedData.name.trim() ||
      !editedData.description.trim() ||
      editedData.price === undefined ||
      editedData.stock === undefined
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      // Actualiza los datos en Firestore con los datos editados
      await updateDoc(doc(db, "products", productId), editedData);
      // Regresa a la pantalla de lista después de la edición
      //navigation.goBack();
      Alert.alert("Se ha actualizado correctamente el producto");
    } catch (error) {
      console.error("Error al editar el producto:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Producto</Text>
      <Text>Nombre:</Text>
      <Input
        leftIcon={<Icon name="inventory" size={24} color="black" />}
        value={editedData.name || ""}
        onChangeText={(text) => setEditedData({ ...editedData, name: text })}
      />
      <Text>Descripcion:</Text>
      <Input
        leftIcon={<Icon name="inventory" size={24} color="black" />}
        value={editedData.description || ""}
        onChangeText={(text) => setEditedData({ ...editedData, description: text })}
      />
      <Text>Precio:</Text>
      <Input
        leftIcon={<Icon name="inventory" size={24} color="black" />}
        value={editedData.price ? editedData.price.toString() : ""}
        onChangeText={(text) =>
          setEditedData({ ...editedData, price: parseFloat(text) })
        }
        keyboardType="numeric"
      />
      <Text>Stock:</Text>
      <Input
        leftIcon={<Icon name="inventory" size={24} color="black" />}
        value={editedData.stock ? editedData.stock.toString() : ""}
        onChangeText={(text) =>
          setEditedData({ ...editedData, stock: parseInt(text) })
        }
        keyboardType="numeric"
      />
      <Button title="Guardar Cambios" onPress={handleEdit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 0,
    padding: 10,
  },
});

export default EditProduct;
