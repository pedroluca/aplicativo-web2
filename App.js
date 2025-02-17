import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const API_URL = 'https://api.portaldatransparencia.gov.br/api-de-dados/emendas';
const AUXILIO_API_URL = 'https://api.portaldatransparencia.gov.br/api-de-dados/auxilio-emergencial-por-cpf-ou-nis';

const Stack = createStackNavigator();

// Tela de Boas-Vindas com dois botões: Emendas e Auxílio Emergencial
const WelcomeScreen = ({ navigation }) => (
  <ImageBackground
    source={require('./assets/background.png')}
    style={styles.background}
  >
    <View style={styles.overlay}>
      <Text style={styles.welcomeTitle}>Portal da Transparência</Text>
      <Text style={styles.welcomeSubtitle}>Acesso a Dados Públicos</Text>
      <TouchableOpacity
        style={styles.enterButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.enterButtonText}>Consultar Emendas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.enterButton, { marginTop: 15 }]}
        onPress={() => navigation.navigate('Auxilio')}
      >
        <Text style={styles.enterButtonText}>Consultar Auxílio Emergencial</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
);

// Tela de Detalhes de Emendas
const DetailsScreen = ({ route }) => {
  const { item } = route.params;

  return (
    <ScrollView style={styles.detailsContainer}>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Código: {item.codigoEmenda}</Text>
        <Text style={styles.detailItem}>Ano: {item.ano}</Text>
        <Text style={styles.detailItem}>Tipo: {item.tipoEmenda}</Text>
        <Text style={styles.detailItem}>Autor: {item.nomeAutor}</Text>
        <Text style={styles.detailItem}>Localidade: {item.localidadeDoGasto}</Text>
        <Text style={styles.detailItem}>Função: {item.funcao}</Text>
        <Text style={styles.detailItem}>Subfunção: {item.subfuncao}</Text>

        <View style={styles.financialSection}>
          <Text style={styles.sectionTitle}>Valores Financeiros</Text>
          <Text style={styles.detailItem}>Empenhado: R$ {item.valorEmpenhado}</Text>
          <Text style={styles.detailItem}>Liquidado: R$ {item.valorLiquidado}</Text>
          <Text style={styles.detailItem}>Pago: R$ {item.valorPago}</Text>
          <Text style={styles.detailItem}>Resto Inscrito: R$ {item.valorRestoInscrito}</Text>
          <Text style={styles.detailItem}>Resto Cancelado: R$ {item.valorRestoCancelado}</Text>
          <Text style={styles.detailItem}>Resto Pago: R$ {item.valorRestoPago}</Text>
        </View>
      </View>
    </ScrollView>
  );
};