import React, { useEffect, useState } from 'react'
import { PeopleOutlined, ConfirmationNumberOutlined } from '@mui/icons-material';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layouts/AdminLayout';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Chip, Grid, MenuItem, Select } from '@mui/material';
import tesloApi from '../../api/tesloApi';
import { IOrder, IUser } from '../../interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Ordern ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre completo', width: 300 },
  { field: 'total', headerName: 'Monto total', width: 300 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    description: "Muestra información si la orden está pagada o no",
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return (
        params.row.isPaid 
          ? <Chip color="success" label="Pagada" variant="outlined"  />
          : <Chip color="error" label="No Pagada" variant="outlined"  />
      )
    }
  },
  { field: 'noProductos', headerName: 'No. Productos', align: 'center', width: 150 },
  {
    field: 'check',
    headerName: 'Ver Orden',
    width: 200,
    renderCell: (row: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${ row.id }`} target="_blank" rel='noreferrer' >
          Ver orden
        </a>
      )
    }
  },
  { field: 'createdAt', headerName: 'Creada:', width: 300},
] 

const OrdersPage = () => {

  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if( !data && !error ) return (<></>);

  // const onRoleUpdated = async(userId: string, newRole: string) => {

  //   const previousUsers = users.map( user => ({...user}) );
  //   const updatedUsers = users.map( user => ({
  //     ...user, 
  //     role: userId === user._id ? newRole : user.role
  //   }));

  //   setUsers(updatedUsers);

  //   try {
  //     await tesloApi.put('/admin/users', { userId, role: newRole });

  //   } catch (error) {
  //     setUsers(previousUsers);
  //     alert('No se pudo actualizar el role del usuario');
  //   }
  // }


  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    noProductos: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout title={'Ordenes'} subtitle={'Mantenimiento de ordenes'} icon={<ConfirmationNumberOutlined /> }>
      
      <Grid container className='fadeIn'>
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid 
            columns={columns}
            rows={rows}  
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>

    </AdminLayout>
  )
}

export default OrdersPage