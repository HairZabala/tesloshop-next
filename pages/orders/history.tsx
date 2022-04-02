import React from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { ShopLayout } from '../../components/layouts'
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: "Muestra información si la orden está pagada o no",
    width: 200,
    renderCell: (params: GridValueGetterParams) => {
      return (
        params.row.paid 
          ? <Chip color="success" label="Pagada" variant="outlined"  />
          : <Chip color="error" label="No Pagada" variant="outlined"  />
      )
    }
  },
  {
    field: 'orden',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
          <Link underline='always'>
            Ver orden
          </Link>
        </NextLink>
      )
    }
  },
]
interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({orders}) => {
  const rows = orders.map((order, idx) => ({
    id: idx + 1,
    paid: order.isPaid,
    fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` ,
    orderId: order._id
  }))
  
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
      
      <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

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
    </ShopLayout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req, query}) => {
  
  const session: any = await getSession({ req });

  if(!session){
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false
      }
    }
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage