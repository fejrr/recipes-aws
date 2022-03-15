import {
  Card,
  Row,
  Col,
  Input,
  Spacer,
  Text,
  Button,
  Container,
  Grid,
  Textarea,
  Loading,
  Modal,
  Checkbox,
} from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify'

const Recipe = () => {
  const router = useRouter()
  const [edit, setEdit] = useState(false)
  const [recipe, setRecipe] = useState({})
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState(false)
  const [addModal, setAddModal] = useState(false)
  const [shoppingList, setShoppingList] = useState([])

  const id = router.query.id

  useEffect(() => {
    if (id) {
      setLoading(true)
      fetchRecipes()
    } else {
      setLoading(false)
    }
  }, [id])

  const fetchRecipes = async () => {
    try {
      const response = await API.get('recipesapi', `/recipes/id`, {
        Key: {
          id,
        },
        Limit: 1,
      })

      setRecipe(response[0])


      const ingredients = response[0].skladniki
      const shoppingList = []
      ingredients.forEach((skladnik) => {
        const pos = {
          id: uuidv4(),
          nazwa: skladnik.nazwa,
          ilosc: skladnik.ilosc,
          dodac: true,
        }
        shoppingList.push(pos)
      })

      setShoppingList(shoppingList)

      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    setEdit(!edit)
  }

  const handleSave = async () => {
    setEdit(!edit)

    try {
      await API.put('recipesapi', `/recipes`, {
        body: recipe,
        id,
        complete: true,
      })

      toast.success('Przepis został zapisany!')
    } catch (error) {
      console.log(error)
      toast.error('Wystąpił błąd podczas zapisywania przepisu!')
    }
  }

  const handleEditRecipe = (target, value) => {
    setRecipe({ ...recipe, [target]: value })
  }

  const handleEditRecipeIngredient = (index, target, value) => {
    const ingredients = [...recipe.skladniki]
    ingredients[index][target] = value
    setRecipe({ ...recipe, skladniki: ingredients })
  }

  const handleEditRecipePic = (value) => {
    const newPrzepis = { ...recipe }
    newPrzepis.obrazek = value

    setRecipe(newPrzepis)
  }

  const handleAddIngredient = () => {
    const newRecipe = { ...recipe }

    newRecipe.skladniki.push({ nazwa: '', ilosc: '' })

    setRecipe(newRecipe)
  }

  const handleAdd = async () => {
    if (addModal) {
      setAddModal(false)

      toast.success('Dodano do listy zakupów')

      shoppingList.forEach(async pos => {

        if (pos.dodac) {
          const newIngredient = {
            id: uuidv4(),
            nazwa: pos.nazwa,
            ilosc: pos.ilosc,
            odznaczone: false,
          }

          try {
            
            await API.post('listapi', '/list', {
              body: newIngredient,
            })

            toast.success('Dodano składniki do listy zakupów')
          } catch (error) {
            console.log(error)
            toast.error('Wystąpił błąd podczas dodawania składnika!')
          }
        }
      })


    } else {
      setAddModal(true)
    }
  }

  const openHandlerDeleteModal = () => {
    setDeleteModal(true)
  }

  const closeHandlerDeleteModal = () => {
    setDeleteModal(false)
  }

  const handleDelete = async () => {

    try {

      await API.del('recipesapi', '/recipes', { body: { id } })

      toast.success('Usunięto przepis')
      router.push('/przepisy')
    } catch (error) {
      toast.error(error)
    }

  }

  const openHandlerAddModal = () => {
    setAddModal(true)
  }

  const closeHandlerAddModal = () => {
    setAddModal(false)
  }

  const handleChangeShoppingList = (id, item) => {
    const newShoppingList = shoppingList
    newShoppingList[id].dodac = !newShoppingList[id].dodac
    setShoppingList(newShoppingList)
  }

  const handleQuaChange = (id, val) => {
    const newShoppingList = shoppingList
    newShoppingList[id].ilosc = val
    setShoppingList(newShoppingList)
  }

  if (loading) {
    return (
      <Col span={12} justify='center' align='center'>
        <Spacer y={10} />
        <Loading
          type='points'
          color='success'
          size='xl'
          textColor='success'
          css={{ mt: '5%' }}
        >
          Pobieram przepis ...
        </Loading>
      </Col>
    )
  }

  return (
    <Container justify='center' css={{ mt: 50 }}>
      {recipe.nazwa ? (
        <Card cover css={{ p: 0 }}>
          <Card.Header>
            <Grid.Container gap={2} justify='center'>
              <Grid xs={12}>
                <Input
                  size='xl'
                  readOnly={!edit}
                  initialValue={recipe.nazwa}
                  status={edit ? 'success' : ''}
                  onChange={(e) => handleEditRecipe('nazwa', e.target.value)}
                  aria-label='nazwa'
                />
              </Grid>
              <Grid xs={12}>
                <Grid.Container justify='space-evenly'>
                  <Grid>
                    <Card.Image
                      src={recipe.obrazek}
                      height={300}
                      width={500}
                      alt={recipe.nazwa}
                    />
                    {edit && (
                      <>
                        <Spacer />
                        <Input
                          size='xl'
                          initialValue={recipe.obrazek}
                          status={edit ? 'success' : ''}
                          onChange={(e) =>
                            handleEditRecipePic(e.target.value)
                          }
                          aria-label='obrazki'
                          clearable
                        />
                      </>
                    )}
                  </Grid>
                  <Grid display='flex' direction='column'>
                    <Text h4>Składniki</Text>
                    {recipe.skladniki.map((skladnik, index) => (
                      <Grid.Container
                        key={index}
                        align='center'
                        alignItems='center'
                      >
                        <Grid>
                          <Text b>{index + 1}</Text>
                        </Grid>
                        <Grid>
                          <Input
                            autoWidth
                            readOnly={!edit}
                            initialValue={skladnik.nazwa}
                            status={edit ? 'success' : ''}
                            onChange={(e) =>
                              handleEditRecipeIngredient(
                                index,
                                'nazwa',
                                e.target.value
                              )
                            }
                            aria-label='skladnik-nazwa'
                            placeholder='nazwa'
                          />
                        </Grid>
                        <Grid>
                          <Input
                            autoWidth
                            readOnly={!edit}
                            initialValue={skladnik.ilosc}
                            status={edit ? 'success' : ''}
                            onChange={(e) =>
                              handleEditRecipeIngredient(
                                index,
                                'ilosc',
                                e.target.value
                              )
                            }
                            aria-label='skladnik-ilosc'
                            placeholder='ilość'
                          />
                        </Grid>
                      </Grid.Container>
                    ))}
                    {edit && (
                      <>
                        <Spacer />
                        <Button
                          type='button'
                          color='success'
                          auto
                          ghost
                          css={{ mx: 20 }}
                          onClick={() => handleAddIngredient()}
                        >
                          Dodaj składnik
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid.Container>
              </Grid>
            </Grid.Container>
          </Card.Header>
          <Card.Body>
            <Row css={{ p: '2%' }}>
              <Col span={12} display='flex'>
                <Text h4>Przepis</Text>
                <Spacer />
                <Textarea
                  readOnly={!edit}
                  initialValue={recipe.przepis}
                  fullWidth
                  bordered
                  spellCheck='false'
                  status={edit ? 'success' : ''}
                  underlined={edit}
                  onChange={(e) => handleEditRecipe('przepis', e.target.value)}
                  aria-label='przepis'
                />
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer
            blur
            css={{
              bgBlur: '#0f1114',
              borderTop: '$borderWeights$light solid $gray700',
              bottom: 0,
              // zIndex: 1,
            }}
          >
            <Row>

              {edit ? (
                <>
                  <Button
                    flat
                    auto
                    rounded
                    color='primary'
                    css={{ m: 5 }}
                    onClick={handleEdit}
                  >
                    <Text
                      css={{ color: 'inherit' }}
                      size={12}
                      weight='bold'
                      transform='uppercase'
                    >
                      Anuluj
                    </Text>
                  </Button>
                  <Button
                    flat
                    auto
                    rounded
                    color='success'
                    css={{ m: 5 }}
                    onClick={handleSave}
                  >
                    <Text
                      css={{ color: 'inherit' }}
                      size={12}
                      weight='bold'
                      transform='uppercase'
                    >
                      Zapisz
                    </Text>
                  </Button>
                </>
              ) : (
                <Button
                  flat
                  auto
                  rounded
                  color='primary'
                  css={{ m: 5 }}
                  onClick={handleEdit}
                >
                  <Text
                    css={{ color: 'inherit' }}
                    size={12}
                    weight='bold'
                    transform='uppercase'
                  >
                    Edytuj
                  </Text>
                </Button>
              )}
              <Button
                flat
                auto
                rounded
                color='error'
                css={{ m: 5 }}
                onClick={openHandlerDeleteModal}
              >
                <Text
                  css={{ color: 'inherit' }}
                  size={12}
                  weight='bold'
                  transform='uppercase'
                >
                  Usuń
                </Text>
              </Button>
              <Row justify='flex-end'>
                <Button
                  flat
                  auto
                  rounded
                  css={{ color: '#94f9f0', bg: '#94f9f026', m: 5 }}
                  onClick={openHandlerAddModal}
                >
                  <Text
                    css={{ color: 'inherit' }}
                    size={12}
                    weight='bold'
                    transform='uppercase'
                  >
                    Dodaj do listy zakupów
                  </Text>
                </Button>
              </Row>
            </Row>
          </Card.Footer>
        </Card>
      ) : (
        <Text>Przepis nie znaleziony</Text>
      )}

      {deleteModal && (
        <Modal
          closeButton
          aria-labelledby='modal-title'
          open={deleteModal}
          onClose={closeHandlerDeleteModal}
          preventClose
        >
          <Modal.Header>
            <Text b size={18}>
              Potwierdź
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Text>Czy na pewno chcesz usunąć przepis?</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button
              size='sm'
              color='primary'
              auto
              onClick={closeHandlerDeleteModal}
            >
              Anuluj
            </Button>
            <Button size='sm' shadow color='error' auto onClick={handleDelete}>
              Usuń
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {addModal && (
        <Modal
          closeButton
          aria-labelledby='modal-title'
          open={addModal}
          onClose={closeHandlerAddModal}
        >
          <Modal.Header>
            <Text b size={18}>
              Dodaj do listy zakupów
            </Text>
          </Modal.Header>
          <Modal.Body>
            {shoppingList && shoppingList.length > 0 ? (
              <Grid.Container gap={2}>
                <Grid xs={12}>
                  <Text h4>Lista zakupów</Text>
                </Grid>
                {shoppingList.map((item, index) => (
                  <Grid xs={12} key={index}>
                    <Checkbox
                      color='success'
                      checked={item.dodac}
                      onChange={() => handleChangeShoppingList(index, item)}
                    />
                    <Input
                      readOnly={!shoppingList[index].dodac}
                      initialValue={item.ilosc}
                      color='success'
                      underlined
                      css={{ mx: 5 }}
                      onChange={(e) => handleQuaChange(index, e.target.value)}
                      aria-label={`${item.nazwa} ilosc`}
                    />
                    <Input
                      readOnly
                      disabled={!shoppingList[index].dodac}
                      initialValue={item.nazwa}
                      className={!shoppingList[index].dodac}
                      aria-label={`${item.nazwa} nazwa`}
                    />
                  </Grid>
                ))}
              </Grid.Container>
            ) : (
              <Text>Brak produktów na liście zakupów</Text>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              size='sm'
              color='primary'
              auto
              onClick={closeHandlerAddModal}
            >
              Anuluj
            </Button>
            <Button size='sm' shadow color='error' auto onClick={handleAdd}>
              Dodaj
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  )
}

export default Recipe
