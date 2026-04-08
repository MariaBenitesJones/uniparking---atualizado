import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";

export default function ListaCarrosScreen({ navigation, route }) {
  const [carros, setCarros] = useState([]);

  useFocusEffect(
    useCallback(() => {
      carregarCarros();
    }, []),
  );

  const carregarCarros = async () => {
    try {
      const dados = await AsyncStorage.getItem("meus_carros");
      const lista = dados ? JSON.parse(dados) : [];
      setCarros(lista);
      console.log("Carregados:", lista.length);
    } catch (e) {
      console.log("Erro ao carregar:", e);
    }
  };

  const salvarCarros = async (lista) => {
    try {
      await AsyncStorage.setItem("meus_carros", JSON.stringify(lista));
      console.log("Salvos:", lista.length);
    } catch (e) {
      console.log("Erro ao salvar:", e);
    }
  };

  const excluirCarro = (index) => {
    Alert.alert("Excluir carro", "Tem certeza que deseja excluir este carro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            const dados = await AsyncStorage.getItem("meus_carros");
            let lista = dados ? JSON.parse(dados) : [];

            lista.splice(index, 1);

            await salvarCarros(lista);
            setCarros(lista);

            console.log("Carro removido");
          } catch (e) {
            console.log("Erro ao excluir:", e);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚗 Meus Carros ({carros.length}/5)</Text>

      {carros.length === 0 ? (
        <View>
          <Text style={styles.vazio}>Nenhum carro cadastrado</Text>

          <View style={{ marginTop: 20 }}>
            <Button
              title="+ Adicionar Carro"
              onPress={() => navigation.navigate("FormCarro")}
            />
          </View>
        </View>
      ) : (
        <FlatList
          data={carros}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <Text style={styles.placa}>{item.placa}</Text>
              <Text style={styles.info}>{item.modelo}</Text>
              <Text style={styles.info}>{item.cor}</Text>

              <View style={styles.acoes}>
                {/* ✏️ EDITAR */}
                <TouchableOpacity
                  style={styles.botaoIcone}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate("FormCarro", {
                      modo: "editar",
                      carro: item,
                      index: index,
                    })
                  }
                >
                  <MaterialIcons name="edit" size={22} color="#2980b9" />
                </TouchableOpacity>

                {/* 🗑️ EXCLUIR */}
                <TouchableOpacity
                  style={styles.botaoIcone}
                  activeOpacity={0.7}
                  onPress={() => excluirCarro(index)}
                >
                  <MaterialIcons name="delete" size={22} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={
            <View style={{ marginTop: 15 }}>
              {carros.length < 5 && (
                <Button
                  title="+ Adicionar Carro"
                  onPress={() => navigation.navigate("FormCarro")}
                />
              )}

              {carros.length === 5 && (
                <Text style={styles.limite}>🚫 Limite atingido.</Text>
              )}
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f2f4f7",
  },

  title: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#2c3e50",
  },

  vazio: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: "#7f8c8d",
  },

  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },

  placa: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2980b9",
  },

  info: {
    fontSize: 13,
    color: "#555",
    marginTop: 1,
  },

  acoes: {
    flexDirection: "row",
    marginTop: 8,
  },

  botaoIcone: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#ecf0f1",
    borderRadius: 6,
    marginHorizontal: 3,
  },

  limite: {
    textAlign: "center",
    color: "#e74c3c",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 10,
  },
});
