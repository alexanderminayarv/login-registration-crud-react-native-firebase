import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  BackHandler,
} from "react-native";
import { FAB, Input, Icon } from "react-native-elements";
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from "@react-navigation/native";
import { doc, getDocs, deleteDoc, collection } from "firebase/firestore";
import { db, auth } from "./../database/firebase";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { signOut } from "firebase/auth";

const Home = ({ route }) => {
  const { firstName } = route.params;
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(documents);
        setOriginalData(documents);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleSignOut
    );

    return () => {
      backHandler.remove();
    };
  }, [isFocused]);

  const addNewProduct = () => {
    navigation.navigate("AddNewProduct");
  };

  const editProduct = (productId) => {
    navigation.navigate("EditProduct", { productId });
  };

  const handleSearch = (text) => {
    setSearchText(text);

    if (text.trim() === "") {
      // Si el campo de búsqueda está vacío, mostrar todos los datos originales
      setData(originalData);
    } else {
      // Filtrar los datos basados en el texto de búsqueda
      const filteredData = originalData.filter(
        (item) =>
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          item.price.toString().includes(text) ||
          item.stock.toString().includes(text)
      );
      setData(filteredData);
    }
  };

  const showConfirmDialog = (productId) => {
    return Alert.alert(
      "¿Estás seguro?",
      "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
      [
        {
          text: "Sí",
          onPress: () => {
            deleteProduct(productId);
          },
        },
        {
          text: "No",
        },
      ]
    );
  };

  const deleteProduct = async (productId) => {
    try {
      // Elimina el producto de Firestore
      await deleteDoc(doc(db, "products", productId));
      // Refresca la lista después de la eliminación
      fetchData();
      alert("El producto ha sido eliminado.");
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(documents);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleSignOut = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      {
        text: "Sí",
        onPress: async () => {
          try {
            await signOut(auth);
            // Volver a la pantalla de inicio de sesión
            navigation.navigate("Login");
          } catch (error) {
            console.error("Error al cerrar sesión:", error);
          }
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  const TableHeader = () => (
    <View style={[styles.itemContainer, styles.header]}>
      <Text style={[styles.headerText, styles.centerText]}>Nombre</Text>
      <Text style={[styles.headerText, styles.centerText]}>Precio</Text>
      <Text style={[styles.headerText, styles.centerText]}>Stock</Text>
      <Text style={[styles.headerText, styles.centerText]}>Acción</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido, {firstName}!</Text>
      <Text style={styles.subtitle}>Hola, ¿cómo estás?</Text>

      <Input
        placeholder="Buscar..."
        leftIcon={<Icon name="search" size={24} color="black" />}
        onChangeText={handleSearch}
        value={searchText}
      />

      <Text style={styles.title}>Tus Productos</Text>
      <FlatList
        ListHeaderComponent={TableHeader}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={[styles.item, styles.centerText]}>{item.name}</Text>
            <Text
              style={[styles.item, styles.centerText]}
            >{`S/. ${item.price}`}</Text>
            <Text style={[styles.item, styles.centerText]}>{item.stock}</Text>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="pencil"
                size={24}
                color="#000"
                onPress={() => editProduct(item.id)}
              />
              <MaterialCommunityIcons
                name="trash-can"
                size={24}
                color="red"
                onPress={() => showConfirmDialog(item.id)}
              />
            </View>
          </View>
        )}
      />
      <FAB
        icon={<Icon name="add" size={24} color="white" />}
        buttonStyle={{ backgroundColor: "#007bff" }}
        onPress={addNewProduct}
        style={styles.fab}
      />
      <FAB
        icon={<Icon name="exit-to-app" size={24} color="white" />}
        title="Cerrar Sesión"
        onPress={handleSignOut}
        buttonStyle={{ backgroundColor: "#0d6e" }}
        style={styles.exit_to_app}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  header: {
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 2,
    borderBottomColor: "#333",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 15,
  },
  centerText: {
    textAlign: "center",
  },
  item: {
    fontSize: 16,
    marginStart: 10,
    flex: 1,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    backgroundColor: "blue",
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  exit_to_app: {
    position: "absolute",
    margin: 16,
    left: 0,
    bottom: 0,
  },
});

export default Home;
