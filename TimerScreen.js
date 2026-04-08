import React, { useState, useEffect } from "react";
import { View, Text, Button, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

export default function TimerScreen() {
  const [inicio, setInicio] = useState(null);
  const [tempoTotal, setTempoTotal] = useState(0);
  const [rodando, setRodando] = useState(false);
  const [carros, setCarros] = useState([]);
  const [carroSelecionado, setCarroSelecionado] = useState(null);

  // carregar carros cadastrados
  useEffect(() => {
    const carregarCarros = async () => {
      const dados = await AsyncStorage.getItem("meus_carros");
      const lista = dados ? JSON.parse(dados) : [];
      setCarros(lista);
      if (lista.length > 0) setCarroSelecionado(lista[0].placa);
    };
    carregarCarros();
  }, []);

  // atualizar contagem em tempo real
  useEffect(() => {
    let intervalo;
    if (rodando) {
      intervalo = setInterval(() => {
        const agora = Date.now();
        const diferenca = (agora - inicio) / 1000; // segundos
        setTempoTotal(diferenca);
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [rodando, inicio]);

  const iniciar = () => {
    setInicio(Date.now());
    setRodando(true);
    setTempoTotal(0);
  };

  const pausar = async () => {
    if (!rodando) return;
    setRodando(false);

    const horas = tempoTotal / 3600;
    const valor = horas * 30;

    const registro = {
      carro: carroSelecionado,
      tempo: horas.toFixed(2),
      valor: valor.toFixed(2),
      data: new Date().toLocaleString(),
    };

    // salvar no histórico
    try {
      const dados = await AsyncStorage.getItem("historico_estacionamentos");
      let lista = dados ? JSON.parse(dados) : [];
      lista.push(registro);
      await AsyncStorage.setItem(
        "historico_estacionamentos",
        JSON.stringify(lista),
      );
    } catch (e) {
      console.log("Erro ao salvar histórico:", e);
    }

    Alert.alert(
      "Estacionamento",
      `Carro: ${carroSelecionado}\nTempo: ${horas.toFixed(2)}h\nValor: R$${valor.toFixed(2)}`,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⏱️ Timer Estacionamento</Text>

      {carros.length > 0 ? (
        <>
          <Text style={styles.label}>Selecione o carro:</Text>
          <Picker
            selectedValue={carroSelecionado}
            style={styles.picker}
            onValueChange={(itemValue) => setCarroSelecionado(itemValue)}
          >
            {carros.map((c, i) => (
              <Picker.Item
                key={i}
                label={`${c.placa} - ${c.modelo}`}
                value={c.placa}
              />
            ))}
          </Picker>
        </>
      ) : (
        <Text style={styles.label}>Nenhum carro cadastrado</Text>
      )}

      <Text style={styles.timer}>
        {Math.floor(tempoTotal / 60)}m {Math.floor(tempoTotal % 60)}s
      </Text>

      <Button
        title="Iniciar"
        onPress={iniciar}
        disabled={rodando || !carroSelecionado}
      />
      <Button title="Pausar" onPress={pausar} disabled={!rodando} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  title: { fontSize: 22, marginBottom: 20 },
  label: { fontSize: 16 },
  picker: { height: 250, width: 250, marginBottom: 2 },
  timer: { fontSize: 28, fontWeight: "bold", marginVertical: 20 },
});
