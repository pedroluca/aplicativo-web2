export const API_URL = 'https://api.portaldatransparencia.gov.br/api-de-dados/emendas'
export const AUXILIO_API_URL = 'https://api.portaldatransparencia.gov.br/api-de-dados/auxilio-emergencial-por-cpf-ou-nis'

export const fetchData = async (url, filters, pageNumber = 1) => {
  try {
    let finalUrl = ${url}?pagina=${pageNumber}
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim() !== '') {
        finalUrl += &${key}=${encodeURIComponent(value)}
      }
    })

    const response = await fetch(finalUrl, {
      headers: {
        'accept': '/',
        'chave-api-dados': '29edb235ac11053ccc227d65559f0961'
      }
    })

    if (!response.ok) throw new Error('Erro na requisição')
    return await response.json()
  } catch (error) {
    throw error
  }
}