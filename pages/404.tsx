import { Box, Typography } from '@mui/material';
import React from 'react'
import { ShopLayout } from '../components/layouts/ShopLayout';

const Custom404 = () => {
  return (
    <ShopLayout title='Page no found' pageDescription='Nada que mostrar'>
      <Box sx={{ flexDirection: { xs: 'column', md: 'row' } }} display='flex' justifyContent={'center'} alignItems='center' height='calc(100vh - 200px)'>
        <Typography variant='h1' component={'h1'} fontSize={60} fontWeight={200}>404 | </Typography>
        <Typography marginLeft={2}>Página no encontrada</Typography>
      </Box>
    </ShopLayout>
  )
}

export default Custom404