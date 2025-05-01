import { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  CircularProgress,
  Divider
} from '@mui/material'
import { toast } from 'react-toastify'
import { vendorService, VendorProfile } from '../../services/api/vendorService'

const Profile = () => {
  const [profile, setProfile] = useState<VendorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await vendorService.getProfile()
      setProfile(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch profile')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      const { name, value } = e.target
      if (name.startsWith('business')) {
        setProfile({
          ...profile,
          vendorInfo: {
            ...profile.vendorInfo,
            [name]: value
          }
        })
      } else {
        setProfile({
          ...profile,
          [name]: value
        })
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      setLoading(true)
      // Format the payload to match the API's expected structure
      const payload = {
        name: profile.name,
        businessName: profile.vendorInfo.businessName,
        businessAddress: profile.vendorInfo.businessAddress,
        businessPhone: profile.vendorInfo.businessPhone,
        businessDescription: profile.vendorInfo.businessDescription,
        businessCategory: profile.vendorInfo.businessCategory
      }

      const updatedProfile = await vendorService.updateProfile(payload)
      setProfile(updatedProfile)
      setError(null)
      toast.success('Profile updated successfully')
    } catch (err) {
      setError('Failed to update profile')
      console.error('Error updating profile:', err)
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Full Name"
                name="name"
                value={profile?.name || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profile?.email || ''}
                onChange={handleChange}
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Business Information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Business Name"
                name="businessName"
                value={profile?.vendorInfo.businessName || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Business Phone"
                name="businessPhone"
                value={profile?.vendorInfo.businessPhone || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Business Address"
                name="businessAddress"
                multiline
                rows={2}
                value={profile?.vendorInfo.businessAddress || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Business Description"
                name="businessDescription"
                multiline
                rows={4}
                value={profile?.vendorInfo.businessDescription || ''}
                onChange={handleChange}
                helperText="Tell potential customers about your business and services"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Business Category"
                name="businessCategory"
                value={profile?.vendorInfo.businessCategory || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}

export default Profile 