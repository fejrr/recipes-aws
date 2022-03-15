import { Card, Row, Text } from '@nextui-org/react'
import { useRouter } from 'next/router'


const Recipe = ({ image, title, id }) => {

  const router = useRouter()
  return (
    <Card hoverable clickable onClick={() => router.push(`/przepisy/${id}`)}>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          objectFit='cover'
          src={image}
          width='100%'
          height={140}
          alt={title}
        />
      </Card.Body>
      <Card.Footer justify='flex-start'>
        <Row wrap='wrap' justify='space-between'>
          <Text b>{title}</Text>
        </Row>
      </Card.Footer>
    </Card>
  )
}

export default Recipe
