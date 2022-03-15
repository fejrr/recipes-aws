import {
  Container,
  Row,
  Col,
  Input,
  Spacer,
  Grid,
  Button,
  Loading,
  Text,
} from '@nextui-org/react'
import Recipe from '../../components/Recipe'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { API } from 'aws-amplify'



function Recipes() {
  const router = useRouter()
  const [searchPhrase, setSearchPhrase] = useState('')
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {

    fetchRecipes()

  }, [])

  const handleSearch = (e) => {

    const phrase = e.target.value

    setSearchPhrase(phrase)

    if (phrase.length > 1) {

      const search = recipes.filter((przepis) => {

        const title = przepis.nazwa.toLowerCase()

        return title.includes(searchPhrase.toLowerCase())

      })

      setSearch(search)

    } else {
      setSearch(recipes)
    }
  }

  const fetchRecipes = async () => {
    setLoading(true)

    try {

      const response = await API.get('recipesapi', '/recipes/id')

      setRecipes(response)
      setSearch(response)

      setLoading(false)
    } catch (error) {

      console.log(error)
      setLoading(false)
    }
  }

  return (
    <Container justify='center' css={{ mt: 20 }}>
      <Row>
        <Col justify='center' align='center' xs={12} md={12} lg={12}>
          <h1>Przepisy</h1>
          <Spacer />
          <Row>
            <Grid.Container gap={2} justify='center'>
              <Grid>
                <Input
                  label='szukaj przepisu'
                  type='search'
                  underlined
                  clearable
                  labelPlaceholder='Szukaj'
                  color='success'
                  width='300px'
                  value={searchPhrase}
                  onChange={handleSearch}
                />
              </Grid>
              <Grid>
                <Button
                  onClick={() => router.push('/przepisy/add')}
                  bordered
                  auto
                  color='success'
                >
                  dodaj nowy
                </Button>
              </Grid>
            </Grid.Container>
          </Row>
          <Grid.Container justify='center' gap={3}>
            {loading ? (
              <>
                <Loading type='points' color='success' size='xl' textColor='success' css={{ mt: '5%' }}>
                  Pobieram przepisy...
                </Loading>
              </>
            ) : (
              search.length > 0 ? (search.map((item) => (
                <Grid key={item.id} xs={12} sm={6} md={3} lg={3} xl={2}>
                  <Recipe
                    id={item.id}
                    image={item.obrazek}
                    title={item.nazwa}
                  />
                </Grid>
              ))
              ) : (
                <>
                  <Row justify='center'>
                    <Col xs={12}>
                      <Spacer y={2} />
                      <Text h2>Brak przepisów</Text>
                    </Col>
                  </Row>
                </>
              )
            )}
          </Grid.Container>
        </Col>
      </Row>
    </Container>
  )
}

export default Recipes
