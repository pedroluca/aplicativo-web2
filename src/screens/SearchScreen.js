import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { API_URL, fetchData } from '../api'
import InputComponent from '../components/InputComponent'
import ButtonComponent from '../components/ButtonComponent'
import ListComponent from '../components/ListComponent'

const SearchScreen = () => {
  const [data, setData] = useState([])
  const [filters, setFilters] = useState({ nomeAutor: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchData(API_URL, filters)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [filters])

  return (
    <View>
      <InputComponent
        placeholder="Nome do Autor"
        value={filters.nomeAutor}
        onChangeText={text => setFilters({ nomeAutor: text })}
      />
      <ButtonComponent title="Buscar" onPress={() => {}} />
      <ListComponent data={data} loading={loading} renderItem={({ item }) => <Text>{item.nomeAutor}</Text>} />
    </View>
  )
}

export default SearchScreen