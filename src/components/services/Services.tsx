import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress
} from '@mui/material'
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material'
import { toast } from 'react-toastify'
import AddServiceDialog from './AddServiceDialog'

interface Service {
  _id: string
  name: string
  description: string
  image: string
  price: number
  discount: number
  duration: number
  availability: string[]
  category: {
    _id: string
    name: string
  }
  vendor: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  __v: number
}

interface Category {
  _id: string
  name: string
  description: string
  image: string
  status: string
  createdAt: string
  updatedAt: string
}

interface CategoriesResponse {
  categories: Category[]
  totalPages: number
  currentPage: number
  totalCategories: number
}

interface ServicesResponse {
  services: Service[]
  totalPages: number
  currentPage: number
  totalServices: number
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  useEffect(() => {
    fetchServices()
    fetchCategories()
  }, [])

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/v1/services', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch services')
      }

      const data: ServicesResponse = await response.json()
      setServices(data.services)
    } catch (error) {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3000/api/v1/vendors/categories?page=1&limit=10', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data: CategoriesResponse = await response.json()
      setCategories(data.categories)
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
    } else {
      setEditingService(null)
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingService(null)
  }

  const handleSubmit = async (serviceData: FormData) => {
    try {
      const token = localStorage.getItem('token')
      const url = editingService
        ? `http://localhost:3000/api/v1/services/${editingService._id}`
        : 'http://localhost:3000/api/v1/services'
      
      const response = await fetch(url, {
        method: editingService ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: serviceData
      })

      if (!response.ok) {
        throw new Error('Failed to save service')
      }

      toast.success(`Service ${editingService ? 'updated' : 'created'} successfully`)
      handleCloseDialog()
      fetchServices()
    } catch (error) {
      throw error // Let the dialog handle the error
    }
  }

  const handleDelete = async (serviceId: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:3000/api/v1/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete service')
      }

      toast.success('Service deleted successfully')
      fetchServices()
    } catch (error) {
      toast.error('Failed to delete service')
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">
          Services
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
        >
          Add New Service
        </Button>
      </Box>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {service.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {service.category.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Vendor: {service.vendor.name}
                </Typography>
                <Typography variant="body2" paragraph>
                  {service.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" color="primary">
                    ${service.price}
                  </Typography>
                  {service.discount > 0 && (
                    <Typography variant="body2" color="error">
                      {service.discount}% off
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Duration: {service.duration} hours
                </Typography>
                <Box mt={1}>
                  {service.availability.map((day) => (
                    <Typography key={day} variant="caption" component="span" sx={{ mr: 1 }}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleOpenDialog(service)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDelete(service._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <AddServiceDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        categories={categories}
      />
    </Container>
  )
}

export default Services 