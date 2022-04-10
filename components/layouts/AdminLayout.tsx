import React, { FC } from 'react'
import { SideMenu } from '../ui'
import { AdminNavbar } from '../admin/AdminNavbar';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string, 
  subtitle: string,
  icon?: JSX.Element
}

export const AdminLayout: FC<Props> = ({title, children, subtitle, icon}) => {
  return (
  <>

    <nav>
      <AdminNavbar />
    </nav>

    <SideMenu />

    <main style={{ 
        margin: '80px auto', 
        maxWidth: '1440px' ,
        padding: '0px 30px',
      }}>

        <Box display='flex' flexDirection='column'>
          <Typography variant='h1' component='h1'>
            { icon }
            {' '}{ title }
          </Typography>
          <Typography variant='h2' sx={{ mb: 1 }}>
            { subtitle }
          </Typography>
        </Box>

        <Box className='fadeIn'>
          {children}
        </Box>

    </main>
  </>

  )
}