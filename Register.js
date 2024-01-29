import { StyleSheet, Text, View, TextInput, Alert, Button } from "react-native";
import React from "react";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "./database/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Input, Icon } from "react-native-elements";

function Register() {
  //Crear 2 variables
  const [nombres, setNombres] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleCreateAccount = () => {

    // Validar campos vacíos
    if (!nombres.trim() || !apellidos.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Alert.alert("Cuenta creada");
        const user = userCredential.user;
        // Obtener el UID del usuario
        const uid = user.uid;
        // Guardar datos adicionales en Firestore
        await addUserDataToFirestore(uid);
        // Limpiar campos después de agregar la cuenta
        setNombres("");
        setApellidos("");
        setEmail("");
        setPassword("");
      })
      .catch((error) => {
        console.error(error);
        Alert.alert(error.message);
      });
  };

  const addUserDataToFirestore = async (uid) => {
    try {
      await addDoc(collection(db, "users"), {
        uid: uid,
        firstName: nombres,
        lastName: apellidos,
        email: email,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crea una nueva cuenta</Text>

      <Text>Nombres:</Text>
      <Input
        onChangeText={(text) => setNombres(text)}
        leftIcon={<Icon name="person" size={24} color="black" />}
        placeholder="Alexander"
      />

      <Text>Apellidos:</Text>
      <Input
        onChangeText={(text) => setApellidos(text)}
        leftIcon={<Icon name="person" size={24} color="black" />}
        placeholder="Minaya Rosas de la Vega"
      />

      <Text>Correo electrónico:</Text>
      <Input
        onChangeText={(text) => setEmail(text)}
        leftIcon={<Icon name="person" size={24} color="black" />}
        placeholder="minaya0209@hotmail.com"
      />

      <Text>Contraseña:</Text>
      <Input
        onChangeText={(text) => setPassword(text)}
        leftIcon={<Icon name="person" size={24} color="black" />}
        placeholder="password"
        secureTextEntry={true}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Crear cuenta"
          onPress={handleCreateAccount}
          color="#3498db"
        />
      </View>
    </View>
  );
}

export default Register;

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
