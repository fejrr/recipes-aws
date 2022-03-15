import {
  Row,
  Col,
  Spacer,
  Text,
  Button,
  Container,
  Grid,
  Loading,
  Checkbox,
} from '@nextui-org/react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { API } from 'aws-amplify'

import { toast } from 'react-toastify'

function List() {
  const router = useRouter()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchList()
  }, [])

  const fetchList = async () => {
    setLoading(true)

    try {
      const l = await API.get('listapi', '/list/nazwa')
      setList(l)

      setLoading(false)
    } catch (error) {
      toast.error(error)
      setLoading(false)
    }
  }

  const handleChange = (id, checked) => {
    const newList = [...list]

    newList.map(async (item) => {
      if (item.id === id) {
        item.odznaczone = checked

        try {
          await API.put('listapi', `/list`, {
            body: item,
            id,
          })
        } catch (error) {
          toast.error(error)
        }
      }
      return item
    })

    setList(newList)
  }

  const checkAll = () => {
    const newLista = list.map((item) => {
      return {
        ...item,
        odznaczone: true,
      }
    })

    setList(newLista)
  }

  const uncheckAll = () => {
    const newLista = list.map((item) => {
      return {
        ...item,
        odznaczone: false,
      }
    })

    setList(newLista)
  }

  const deleteAll = async () => {
    setLoading(true)

    list.map(async (item) => {
      const id = item.id

      try {
        await API.del('listapi', '/list', { body: { id } })
        toast.success('Usunięto ')
      } catch (error) {
        toast.error(error)
      }
    })

    setList([])
    setLoading(false)
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
          Pobieram listę ...
        </Loading>
      </Col>
    )
  }

  return (
    <Container css={{ mt: 20 }}>
      <Row>
        <Col justify='center' align='center' xs={12} md={12} lg={12}>
          <Text h1>Lista zakupów</Text>
        </Col>
      </Row>
      <Spacer />
      <Grid.Container>
        {list.length > 0 ? (
          list.map((item, index) => (
            <Grid key={index} xs={12} gap={2} justify='center'>
              <Col span={12} offset={4}>
                <Checkbox
                  checked={item.odznaczone}
                  onChange={(e) => handleChange(item.id, e.target.checked)}
                  label={`${item.nazwa} ${item.ilosc}`}
                  color='success'
                  line
                />
              </Col>
            </Grid>
          ))
        ) : (
          <Grid xs={12} gap={2} justify='center'>
            <Text>Brak produktów na liście</Text>
          </Grid>
        )}
      </Grid.Container>
      {list.length > 0 && (
        <>
          <Spacer />
          <Grid.Container>
            <Grid xs={12} display="flex" justify="center" css={{gap: 5}}>
              <Button
                onClick={() => checkAll()}
                color='success'
                auto
                size='sm'
              >
                Zaznacz wszystkie
              </Button>
              <Button
                onClick={() => uncheckAll()}
                color='primary'
                auto
                size='sm'
              >
                Odznacz wszystkie
              </Button>
              <Button
                onClick={() => deleteAll()}
                color='error'
                auto
                size='sm'
              >
                Usuń wszystkie
              </Button>
            </Grid>
          </Grid.Container>
        </>
      )}
    </Container>
  )
}

export default List
