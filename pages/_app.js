import '../styles/globals.css'
import Layout from '../components/Layout'
// 1. Import `createTheme`
import { createTheme, NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


// 2. Call `createTheme` and pass your custom values
const lightTheme = createTheme({
  type: 'light',
  theme: {
    // colors: {...}, // optional
  },
})

const darkTheme = createTheme({
  type: 'dark',
  theme: {
    // colors: {...}, // optional
  },
})

function MyApp({ Component, pageProps, signOut, user }) {
  return (
    <>
      <NextThemesProvider
        defaultTheme='system'
        attribute='class'
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <NextUIProvider>
          <Layout>
            <Component {...pageProps} />
            <ToastContainer autoClose={2000} />
          </Layout>

        </NextUIProvider>
      </NextThemesProvider>
    </>
  )
}

export default MyApp