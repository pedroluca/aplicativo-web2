import React from 'react'
import { FlatList, ActivityIndicator, Text } from 'react-native'
import CardComponent from './CardComponent'

const ListComponent = ({ data, loading, renderItem }) => (
  <>
    {loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
    <FlatList
      data={data}
      keyExtractor={(item, index) => ${item.id}-${index}}
      renderItem={renderItem}
    />
  </>
)

export default ListComponent