import { BrowserRouter } from 'react-router-dom'
import Router from './Router'
import { Grid2 as Grid } from '@mui/material'
import useAuthStore from './store/AuthStore'
import { useEffect } from 'react'
import axios from 'axios'
import AlertCentral from './components/AlertCentral'

function App() {
  const { logout, accessToken, getUserData } = useAuthStore()

  axios.defaults.baseURL = import.meta.env.VITE_API_URL
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        logout()
      }

      return Promise.reject(error)
    }
  )

  useEffect(
    () => {
      if (accessToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        getUserData()
      }
    },
    [accessToken]
  )

  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <AlertCentral />
    </Grid>
  )
}

export default App
