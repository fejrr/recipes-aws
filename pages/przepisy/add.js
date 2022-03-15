import { useState } from 'react';
import { API } from 'aws-amplify'
import { useRouter } from 'next/router';
import { Card, Row, Col, Input, Spacer, Text, Button, Container, Grid, Switch, Textarea, Modal } from '@nextui-org/react';
import { v4 as uuidv4 } from 'uuid';
const RecipeAdd = () => {

  const router = useRouter();

  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [ingredients, setIngredients] = useState([{ nazwa: '', ilosc: '' }])
  const [recipe, setRecipe] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState([]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { nazwa: '', ilosc: '' }])

  }
  const handleDeleteIngredient = (id) => {
    setIngredients(ingredients.filter((item, index) => index !== id))
  }

  const updateIngredientTitle = (id, value) => {
    const newIngredients = [...ingredients];
    newIngredients[id].nazwa = value;
    setIngredients(newIngredients);
  }

  const updateIngredientQua = (id, value) => {
    const newIngredients = [...ingredients];
    newIngredients[id].ilosc = value;
    setIngredients(newIngredients);
  }

  const handleSubmit = async (e) => {

    e.preventDefault();

    const data = {
      id: uuidv4(),
      nazwa: title,
      obrazek: link,
      skladniki: ingredients,
      przepis: recipe,
    }

    const errors = [];

    if (title === '') {
      errors.push('Nazwa jest wymagana')
    }

    if (link === '') {
      link = 'https://upload.wikimedia.org/wikipedia/commons/9/98/Brak_zdj%C4%99cia.svg'
    }

    if (ingredients.length === 0) {
      errors.push('Składniki są wymagane')

    } else {
      ingredients.forEach((ingredient, index) => {
        if (ingredient.nazwa === '') {
          errors.push(`Składnik ${index + 1} nie ma nazwy`)
        }
        // if (skladnik.ilosc === '') {
        //   errors.push(`Składnik ${index + 1} nie ma ilości`)
        // }
      })
    }

    if (recipe === '') {
      errors.push('Przepis jest wymagany')
    }

    if (errors.length > 0) {
      setErrorMessage(errors)
      setErrorModal(true)
      return;
    }


    try {

      await API.post('recipesapi', '/recipes', { body: data })
      router.push('/przepisy')

    } catch (error) {

      console.log(error)

    }
  }

  const closeHandler = () => {
    setErrorModal(false)
  }




  return (
    <Container justify='center' css={{ mt: 20 }}>
      <Row>
        <Col justify='center' align='center' xs={12} md={12} lg={12}>
          <Text h1>Dodaj nowy przepis</Text>
          <Spacer />
          <Grid.Container gap={2} justify='center'>
            <Grid xs={12} md={6}>
              <form onSubmit={handleSubmit}>
                <Card css={{ w: '100%', p: 0 }}>
                  <Card.Header>
                    <Col>
                      <Grid.Container gap={1} xs={12} align='left'>
                        <Grid>
                          <Input size='xl' labelLeft="Nazwa" type="text" name="nazwa" status={title != '' ? "success" : "error"} value={title} onChange={e => setTitle(e.target.value)} autoComplete='off' required />
                        </Grid>
                        <Grid>
                          <Row align='center' justify='flex-start'>
                            <Text span size={20}>Link</Text>
                            <Input type="url" name="link" clearable value={link} labelLeft="Link" status="success" placeholder='nie jest wymagany' autoComplete='off' css={{ mx: 20, w: 500 }} onChange={(e) => setLink(e.target.value)} aria-label='zdjęcie' />
                          </Row>
                        </Grid>
                      </Grid.Container>
                    </Col>
                  </Card.Header>
                  <Spacer />
                  <Card.Body>
                    <Grid.Container xs={12} gap={1}>
                      <Grid>
                        <Text h3>Składniki</Text>
                      </Grid>
                      {ingredients.map((item, i) => (
                        <Grid key={i} xs={12} id={`ingredient-${i}`}>
                          <Row align="center">
                            <Text span size={20}>{i + 1}</Text>
                            <Input labelLeft="Nazwa" type="text" status={item.nazwa != '' ? "success" : "warning"} autoComplete='off' css={{ mx: 20 }} onChange={e => updateIngredientTitle(i, e.target.value)} autoFocus={i > 0 ? true : false} />
                            <Input labelLeft="Ilość" type="text" status={item.ilosc != '' ? "success" : "warning"} autoComplete='off' onChange={e => updateIngredientQua(i, e.target.value)} />
                            <Button type='button' size='xs' color="error" auto ghost css={{ mx: 20 }} onClick={() => handleDeleteIngredient(i)}>Usuń</Button>
                          </Row>
                        </Grid>
                      ))}
                      <Spacer />
                      <Grid xs={12}>
                        <Row align='center'>
                          <Button type='button' color="success" auto ghost css={{ mx: 20 }} onClick={() => handleAddIngredient()}>Dodaj składnik</Button>
                        </Row>
                      </Grid>
                      <Grid xs={12}>
                        <Text h3>Przepis</Text>
                      </Grid>
                      <Grid xs={12}>
                        <Textarea name="przepis" status={recipe != '' ? "success" : "error"} helperText={recipe.length + ' znaków'} helperColor={recipe != '' ? "success" : "error"} spellCheck='false' value={recipe} css={{ mx: 20, w: '40vw' }} fullWidth required onChange={e => setRecipe(e.target.value)} />
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                  <Spacer />
                  <Card.Footer>
                    <Row>
                      <Button type="submit" flat auto rounded css={{ color: '#94f9f0', bg: '#94f9f026' }}>
                        <Text css={{ color: 'inherit' }} size={12} weight="bold" transform="uppercase">
                          Zapisz przepis
                        </Text>
                      </Button>
                    </Row>
                  </Card.Footer>
                </Card>
              </form>
            </Grid>
            <Grid xs={12} md={6}>
              {link && (
                <Card>
                  <Card.Header >
                    <Text h3>Zdjęcie</Text>
                  </Card.Header>
                  <Card.Body>
                    <Card.Image
                      objectFit='cover'
                      src={link}
                      width='100%'
                      height={500}
                      alt='zdjęcie'
                    />
                  </Card.Body>
                </Card>
              )}
            </Grid>
          </Grid.Container>
        </Col>
      </Row>
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={errorModal}
        onClose={closeHandler}
      >
        <Modal.Header>

          <Text b size={18}>
            Błąd
          </Text>
        </Modal.Header>
        <Modal.Body>
          {errorMessage.map((item, i) => (
            <Col key={i} span={12} css={{ m: 0 }}>
              <Text size={14} color="error">
                {item}
              </Text>
            </Col>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onClick={closeHandler}>
            Zamknij
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default RecipeAdd;