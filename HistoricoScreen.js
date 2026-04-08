import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      const dados = await AsyncStorage.getItem("historico_estacionamentos");
      const lista = dados ? JSON.parse(dados) : [];
      setHistorico(lista);
    };
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📜 Histórico de Estacionamentos</Text>
      {historico.length === 0 ? (
        <Text style={styles.vazio}>Nenhum registro encontrado</Text>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.info}>🚗 {item.carro}</Text>
              <Text style={styles.info}>⏱️ {item.tempo}h</Text>
              <Text style={styles.info}>💰 R${item.valor}</Text>
              <Text style={styles.data}>{item.data}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  vazio: { textAlign: 'center', marginTop: 20, color: '#666' },
  card: { backgroundColor: '#fff', padding: 10, borderRadius: 8, marginBottom: 10, elevation: 2 },
  info: { fontSize: 16 },
  data: { fontSize: 12, color: '#999', marginTop: 5 }
});
