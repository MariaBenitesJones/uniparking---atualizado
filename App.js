import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, Alert, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Button } from 'react-native';
import { useState, useEffect } from 'react';
import ListaCarrosScreen from './ListaCarrosScreen';
import FormCarroScreen from './FormCarroScreen';
import TesteStorage from './TesteStorage';
import TimerScreen from './TimerScreen';
import HistoricoScreen from './HistoricoScreen';

const Stack = createStackNavigator();

// Simulação de banco de dados em memória
let usuariosDB = [];

// TELA DE CADASTRO
function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleCadastro = () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    const emailExiste = usuariosDB.some(user => user.email === email);
    if (emailExiste) {
      Alert.alert('Erro', 'Email já cadastrado');
      return;
    }
    const novoUsuario = {
      id: Date.now().toString(),
      nome: nome,
      email: email,
      senha: senha,
      carros: []
    };
    usuariosDB.push(novoUsuario);
    Alert.alert('Sucesso', 'Cadastro realizado!');
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Criar Conta</Text>
          <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <View style={styles.senhaContainer}>
            <TextInput style={styles.senhaInput} placeholder="Senha" secureTextEntry={!mostrarSenha} value={senha} onChangeText={setSenha} />
            <Button title={mostrarSenha ? '🔒' : '👁️'} onPress={() => setMostrarSenha(!mostrarSenha)} color="#666" />
          </View>
          <View style={styles.senhaContainer}>
            <TextInput style={styles.senhaInput} placeholder="Confirmar Senha" secureTextEntry={!mostrarConfirmarSenha} value={confirmarSenha} onChangeText={setConfirmarSenha} />
            <Button title={mostrarConfirmarSenha ? '🔒' : '👁️'} onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} color="#666" />
          </View>
          <View style={styles.buttonSpacing}><Button title="Cadastrar" onPress={handleCadastro} color="#007AFF" /></View>
          <View style={styles.buttonSpacing}><Button title="Já tem conta? Faça login" onPress={() => navigation.navigate('Login')} color="#666" /></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// TELA DE LOGIN
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    const usuario = usuariosDB.find(user => user.email === email && user.senha === senha);
    if (usuario) {
      Alert.alert('Sucesso', 'Login realizado!');
      navigation.replace('Home');
    } else {
      Alert.alert('Erro', 'Email ou senha inválidos');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>UniParking</Text>
          <Text style={styles.subtitle}>Faça seu login</Text>
          <TextInput style={styles.input} placeholder="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
          <View style={styles.senhaContainer}>
            <TextInput style={styles.senhaInput} placeholder="Senha" secureTextEntry={!mostrarSenha} value={senha} onChangeText={setSenha} />
            <Button title={mostrarSenha ? '🔒' : '👁️'} onPress={() => setMostrarSenha(!mostrarSenha)} color="#666" />
          </View>
          <View style={styles.buttonSpacing}><Button title="Entrar" onPress={handleLogin} color="#007AFF" /></View>
          <View style={styles.buttonSpacing}><Button title="Não tem conta? Cadastre-se" onPress={() => navigation.navigate('Cadastro')} color="#666" /></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// TELA HOME
function HomeScreen({ navigation }) {
  const handleLogout = () => navigation.replace('Login');
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo!</Text>
      <View style={styles.buttonSpacing}><Button title="🚗 Meus Carros" onPress={() => navigation.navigate('ListaCarros')} color="#007AFF" /></View>
      <View style={styles.buttonSpacing}>
  <Button 
    title="💰 Calcular Estacionamento" 
    onPress={() => navigation.navigate('Timer')} 
    color="#007AFF" 
  />
</View>
<View style={styles.buttonSpacing}>
  <Button 
    title="📜 Histórico" 
    onPress={() => navigation.navigate('Historico')} 
    color="#007AFF" 
  />
</View>      <View style={styles.buttonSpacing}><Button title="Sair da conta" onPress={handleLogout} color="#FF3B30" /></View>
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#007AFF' },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 40, color: '#666' },
  welcome: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  senhaContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 15 },
  senhaInput: { flex: 1, padding: 12, fontSize: 16 },
  buttonSpacing: { marginBottom: 15, marginTop: 5 }
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Teste" component={TesteStorage} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ title: 'Criar Conta', headerLeft: null, gestureEnabled: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Menu Principal', headerLeft: null, gestureEnabled: false }} />
        <Stack.Screen name="ListaCarros" component={ListaCarrosScreen} options={{ title: 'Meus Carros' }} />
        <Stack.Screen name="FormCarro" component={FormCarroScreen} options={{ title: 'Adicionar Carro' }} />
        <Stack.Screen name="Timer" component={TimerScreen} options={{ title: 'Calcular Estacionamento' }} />
        <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}