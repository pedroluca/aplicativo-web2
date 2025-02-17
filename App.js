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



// Tela de Busca de Emendas
const SearchScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    nomeAutor: ''
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (pageNumber = 1, isRefresh = false) => {
    setLoading(true);
    setError('');
    try {
      let url = ${API_URL}?pagina=${pageNumber};
      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim() !== '') {
          url += &${key}=${encodeURIComponent(value)};
        }
      });
      const response = await fetch(url, {
        headers: {
          'accept': '/',
          'chave-api-dados': '29edb235ac11053ccc227d65559f0961'
        }
      });
      if (!response.ok) throw new Error('Erro na requisição');
      const json = await response.json();
      setData(prev => isRefresh || pageNumber === 1 ? json : [...prev, ...json]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(page); }, [page, fetchData]);

  const handleSearch = () => {
    setPage(1);
    fetchData(1, true);
  };

  const handleLoadMore = () => !loading && setPage(prev => prev + 1);
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchData(1, true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('Details', { item })}
    >
      <Text style={styles.title}>{item.numeroEmenda} - {item.tipoEmenda}</Text>
      <Text>Autor: {item.nomeAutor}</Text>
      <Text>Ano: {item.ano} | Localidade: {item.localidadeDoGasto}</Text>
      <Text>Valor Pago: R$ {item.valorPago}</Text>
      <Button title="Saiba mais" onPress={() => navigation.navigate('Details', { item })} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nome do Autor"
          value={filters.nomeAutor}
          onChangeText={text => setFilters(prev => ({ ...prev, nomeAutor: text }))}
          multiline={false}
          numberOfLines={1}
        />
        <View style={styles.fullWidthButton}>
          <Button title="Aplicar Filtros" onPress={handleSearch} />
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
          <Button title="Tentar novamente" onPress={handleSearch} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => ${item.codigoEmenda}-${index}}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={!loading && <Text style={styles.emptyText}>Nenhum dado encontrado</Text>}
        />
      )}
    </View>
  );
};

// Tela de Busca de Auxílio Emergencial
const AuxilioScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    codigoBeneficiario: ''
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  // Flag para indicar que o usuário acionou a pesquisa
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const fetchData = useCallback(async (pageNumber = 1, isRefresh = false) => {
    // Só busca se a pesquisa foi submetida
    if (!searchSubmitted) return;
    setLoading(true);
    setError('');
    try {
      let url = ${AUXILIO_API_URL}?pagina=${pageNumber};
      Object.entries(filters).forEach(([key, value]) => {
        if (value.trim() !== '') {
          url += &${key}=${encodeURIComponent(value)};
        }
      });
      const response = await fetch(url, {
        headers: {
          'accept': '/',
          'chave-api-dados': '29edb235ac11053ccc227d65559f0961'
        }
      });
      if (!response.ok) throw new Error('Erro na requisição');
      const json = await response.json();
      setData(prev => isRefresh || pageNumber === 1 ? json : [...prev, ...json]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [filters, searchSubmitted]);

  useEffect(() => {
    if (searchSubmitted) {
      fetchData(page);
    }
  }, [page, fetchData, searchSubmitted]);

  const handleSearch = () => {
    setSearchSubmitted(true);
    setPage(1);
    fetchData(1, true);
  };

  const handleLoadMore = () => !loading && setPage(prev => prev + 1);
  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchData(1, true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('AuxilioDetails', { item })}
    >
      <Text style={styles.title}>Beneficiário: {item.beneficiario.nome}</Text>
      <Text>NIS: {item.beneficiario.nis}</Text>
      <Text>Mês: {item.mesDisponibilizacao}</Text>
      <Button title="Saiba mais" onPress={() => navigation.navigate('AuxilioDetails', { item })} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite CPF ou NIS"
          value={filters.codigoBeneficiario}
          onChangeText={text => setFilters(prev => ({ ...prev, codigoBeneficiario: text }))}
          multiline={false}
          numberOfLines={1}
        />
        <View style={styles.fullWidthButton}>
          <Button title="Consultar Auxílio" onPress={handleSearch} />
        </View>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
          <Button title="Tentar novamente" onPress={handleSearch} />
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => ${item.id}}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && <ActivityIndicator size="small" color="#0000ff" />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={!loading && searchSubmitted && <Text style={styles.emptyText}>Nenhum dado encontrado</Text>}
        />
      )}
    </View>
  );
};

// Tela de Detalhes do Auxílio Emergencial com layout aprimorado
const AuxilioDetailsScreen = ({ route }) => {
  const { item } = route.params;
  return (
    <ScrollView style={styles.detailsContainer}>
      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Detalhes do Auxílio Emergencial</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Dados do Beneficiário</Text>
          <Text style={styles.detailItem}>Nome: {item.beneficiario.nome}</Text>
          <Text style={styles.detailItem}>CPF: {item.beneficiario.cpfFormatado}</Text>
          <Text style={styles.detailItem}>NIS: {item.beneficiario.nis}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Dados do Responsável</Text>
          <Text style={styles.detailItem}>Nome: {item.responsavelAuxilioEmergencial.nome}</Text>
          <Text style={styles.detailItem}>CPF: {item.responsavelAuxilioEmergencial.cpfFormatado}</Text>
          <Text style={styles.detailItem}>NIS: {item.responsavelAuxilioEmergencial.nis}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Dados do Município</Text>
          <Text style={styles.detailItem}>Município: {item.municipio.nomeIBGE}</Text>
          <Text style={styles.detailItem}>Código IBGE: {item.municipio.codigoIBGE}</Text>
          <Text style={styles.detailItem}>Região: {item.municipio.nomeRegiao}</Text>
          <Text style={styles.detailItem}>UF: {item.municipio.uf.sigla}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Informações do Auxílio</Text>
          <Text style={styles.detailItem}>Mês Disponibilização: {item.mesDisponibilizacao}</Text>
          <Text style={styles.detailItem}>Situação: {item.situacaoAuxilioEmergencial}</Text>
          <Text style={styles.detailItem}>Enquadramento: {item.enquadramentoAuxilioEmergencial}</Text>
          <Text style={styles.detailItem}>Valor: R$ {item.valor}</Text>
          <Text style={styles.detailItem}>Parcela: {item.numeroParcela}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

