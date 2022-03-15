import Navbar from './Navbar'
import { Container, Row, Col } from '@nextui-org/react';
import { withAuthenticator } from '@aws-amplify/ui-react'
import Amplify from 'aws-amplify'
import awsconfig from '../src/aws-exports'

Amplify.configure(awsconfig)

function Layout({ children, signOut }) {
  return (
    <Container>
      <button onClick={signOut}>Sign Out</button>
      <main style={{ marginBottom: '100px' }}>{children}</main>
      <Navbar />
    </Container>
  )
}

export default withAuthenticator(Layout)