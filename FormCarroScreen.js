import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FormCarroScreen({ navigation, route }) {
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');

  const modo = route.params?.modo;
  const index = route.params?.index;

  // 🔥 Preenche os campos quando for editar
  useEffect(() => {
    if (modo === 'editar' && route.params?.carro) {
      const carro = route.params.carro;
      setPlaca(carro.placa);
      setModelo(carro.modelo);
      setCor(carro.cor);
    }
  }, []);

  const salvar = async () => {
    if (!placa || !modelo || !cor) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const dados = await AsyncStorage.getItem('meus_carros');
      let lista = dados ? JSON.parse(dados) : [];

      if (modo === 'editar') {
        // 🔥 EDITA (não adiciona!)
        lista[index] = { placa, modelo, cor };
      } else {
        // 🔥 ADICIONA
        if (lista.length >= 5) {
          Alert.alert('Limite', 'Máximo de 5 carros');
          return;
        }

        lista.push({ placa, modelo, cor });
      }

      await AsyncStorage.setItem('meus_carros', JSON.stringify(lista));

      console.log('Salvos:', lista.length);

      navigation.goBack(); // 🔥 volta pra lista
    } catch (e) {
      console.log('Erro ao salvar:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {modo === 'editar' ? '✏️ Editar Carro' : '🚗 Adicionar Carro'}
      </Text>

      <TextInput style={styles.input} placeholder="Placa" value={placa} onChangeText={setPlaca} />
      <TextInput style={styles.input} placeholder="Modelo" value={modelo} onChangeText={setModelo} />
      <TextInput style={styles.input} placeholder="Cor" value={cor} onChangeText={setCor} />

      <Button title="Salvar" onPress={salvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  }
});