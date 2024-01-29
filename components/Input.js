import { Text, View, StyleSheet, TextInput } from "react-native";
import React from "react";
import { COLORS, SIZES, SHADOWS } from "../constants";
import Ionicons from "@expo/vector-icons/Ionicons";

const Input = ({label, error, iconName, password,onFocus = () => {}, ...props}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <View style={{ marginBottom: 0 }}>
      <Text style={style.label}>{label}</Text>
      <View
        style={[
          style.inputContainer,
          {
            borderColor: error
              ? COLORS.red
              : isFocused
              ? COLORS.darkBlue
              : COLORS.light,
            alignItems: "center",
            borderRadius: 25,
          },
        ]}
      >
        <Ionicons
          name={iconName}
          style={{
            color: COLORS.darkBlue,
            fontSize: 22,
            marginRight: 10,
          }}
        />
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          style={{ color: COLORS.darkBlue, flex: 1 }}
          {...props}
        />
        {password && (
          <Ionicons
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? "eye" : "eye-off"}
            style={{
              color: COLORS.darkBlue,
              fontSize: 22,
            }}
          />
        )}
      </View>
      {error && (
        <Text
          style={{
            marginTop: 3,
            color: COLORS.red,
            marginLeft: 20,
            fontSize: 13,
            fontFamily: "semibold",
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    marginVertical: 0,
    fontSize: 14,
    color: COLORS.grey,
  },
  inputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    flexDirection: "row",
    paddingHorizontal: 10,
    borderWidth: 0.5,
  },
});

export default Input;