import { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material'
import { toast } from 'react-toastify'

interface DashboardStats {
  totalServices: number
  activeOrders: number
  totalEarnings: number
  completedOrders: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3000/api/v1/vendor/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats')
        }

        const data = await response.json()
        setStats(data)
      } catch (error) {
        toast.error('Failed to load dashboard statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'primary.main',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Services
            </Typography>
            <Typography component="p" variant="h4">
              {stats?.totalServices || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'secondary.main',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Active Orders
            </Typography>
            <Typography component="p" variant="h4">
              {stats?.activeOrders || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'success.main',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Total Earnings
            </Typography>
            <Typography component="p" variant="h4">
              ${stats?.totalEarnings || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: 'info.main',
              color: 'white'
            }}
          >
            <Typography component="h2" variant="h6" gutterBottom>
              Completed Orders
            </Typography>
            <Typography component="p" variant="h4">
              {stats?.completedOrders || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard 