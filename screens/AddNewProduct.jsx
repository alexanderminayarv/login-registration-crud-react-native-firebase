import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import React from "react";
import { auth, db } from "./../database/firebase";
import { addDoc, collection } from "firebase/firestore";
import { Input, Icon } from "react-native-elements";

const AddNewProduct = () => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [stock, setStock] = React.useState("");

  const handleAddProduct = async () => {
    // Validar campos vacíos
    if (!name.trim() || !description.trim() || !price.trim() || !stock.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      await addDoc(collection(db, "products"), {
        uid: auth.currentUser.uid,
        name: name,
        description: description,
        price: price,
        stock: stock,
      });

      // Limpiar campos después de agregar el producto
      setName("");
      setDescription("");
      setPrice("");
      setStock("");
      
      Alert.alert("Se agregó correctamente el producto");
    } catch (error) {
      console.error(error);
      Alert.alert("Error al guardar datos en Firestore");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Nuevo Producto</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Input
          placeholder="Ingrese el nombre"
          leftIcon={<Icon name="inventory" size={24} color="black" />}
          onChangeText={(text) => setName(text)}
          value={name}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción:</Text>
        <Input
          placeholder="Ingrese la descripción"
          leftIcon={<Icon name="inventory" size={24} color="black" />}
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Precio:</Text>
        <Input
          placeholder="Ingrese el precio"
          leftIcon={<Icon name="inventory" size={24} color="black" />}
          keyboardType="numeric"
          value={price}
          onChangeText={(text) => setPrice(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Stock:</Text>
        <Input
          placeholder="Ingrese el stock"
          leftIcon={<Icon name="inventory" size={24} color="black" />}
          keyboardType="numeric"
          value={stock}
          onChangeText={(text) => setStock(text)}
        />
      </View>

      <Button title="Agregar Producto" onPress={handleAddProduct} />
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
  inputContainer: {
    marginBottom: 0,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
  },
});

export default AddNewProduct;
