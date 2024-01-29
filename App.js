import { Button, StyleSheet, Text, View, Alert } from "react-native";
import React from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, where, query, getDocs } from "firebase/firestore";

import { app, db } from "./database/firebase";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import HomeScreen from "./screens/Home";
import RegisterScreen from "./Register";
import AddNewProductScreen from "./screens/AddNewProduct";
import EditProductScreen from "./screens/EditProduct";

import { Input, Icon } from "react-native-elements";

function LoginScreen() {
  //Crear 2 variables
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigation = useNavigation();

  //const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleSignIn = async () => {
    try {

      // Validar campos vacíos
      if (!email.trim() || !password.trim()) {
        Alert.alert(
          "Error",
          "Correo electrónico y contraseña son obligatorios"
        );
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Obtener documentos en la colección 'users' donde el campo 'uid' coincide con el uid del usuario actual
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Debería haber solo un documento ya que estamos filtrando por el uid del usuario
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        const firstName = userData.firstName;

        // Limpiar campos independientemente del resultado de la consulta
        setEmail("");
        setPassword("");

        // Enviar a la ventana Home
        navigation.navigate("Home", { firstName });
      } else {
        Alert.alert("Error", "No se encontraron datos de usuario.");
      }
    } catch (error) {
      console.log("Error al iniciar sesión:", error);

      // Mostrar mensaje de error adecuado
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        Alert.alert("Error", "Correo electrónico o contraseña incorrectos");
      } else {
        Alert.alert(
          "Error",
          "Error al iniciar sesión. Por favor, intenta nuevamente."
        );
      }
    }
  };

  const handleCreateAccount = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text>Correo electrónico:</Text>
      <Input
        onChangeText={(text) => setEmail(text)}
        placeholder="tucorreo@hotmail.com"
        value={email}
        leftIcon={<Icon name="person" size={24} color="black" />}
      />

      <Text>Contraseña:</Text>
      <Input
        onChangeText={(text) => setPassword(text)}
        placeholder="*********"
        value={password}
        secureTextEntry={true}
        leftIcon={<Icon name="lock" size={24} color="black" />}
      />

      <View style={styles.buttonContainer}>
        <Button title="Entrar" onPress={handleSignIn} color="#3498db" />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Crear cuenta"
          onPress={handleCreateAccount}
          color="#2ecc71"
        />
      </View>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="AddNewProduct" component={AddNewProductScreen} />
        <Stack.Screen name="EditProduct" component={EditProductScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 0,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginVertical: 8,
  },
});
