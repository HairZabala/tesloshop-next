import { AttachMoneyOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import React, { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { Grid, Typography } from '@mui/material';
import { SummaryTile } from '../../components/SummaryTile';
import useSWR from 'swr';

const DashboardPage = () => {

  const { data, error } = useSWR('/api/admin/dashboard', {
    refreshInterval: 3 * 10000 // 30 seconds
  });

  const [refreshInt, setRefreshInt] = useState(30);

  useEffect(() => {
    
    const interval = setInterval(() => {
      console.log('tick');
      setRefreshInt(refreshInt => refreshInt > 1 ? refreshInt -1 : 30 );
    }, 1000)
  
    return () => clearInterval(interval);
  }, [])
  

  if(!data && !error){
    return (<></>);
  }

  if(error){
    console.log(error);
    return(
      <Typography>Error al cargar la data.</Typography>
    )
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productWithNoInventory,
    lowInventory,
  } = data;

  return (
    <AdminLayout
      title='Dashboard'
      subtitle='Estadisticas generales'
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <SummaryTile title={numberOfOrders} subTitle='Ordenes totales' icon={<CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }}/>}/>
        <SummaryTile title={paidOrders} subTitle='Ordenes pagadas' icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }}/>}/>
        <SummaryTile title={notPaidOrders} subTitle='Ordenes pendiente' icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }}/>}/>
        <SummaryTile title={numberOfClients} subTitle='Clientes' icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }}/>}/>
        <SummaryTile title={numberOfProducts} subTitle='Productos' icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }}/>}/>
        <SummaryTile title={productWithNoInventory} subTitle='Sin existencias' icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }}/>}/>
        <SummaryTile title={lowInventory} subTitle='Bajo inventario' icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }}/>}/>
        <SummaryTile title={refreshInt} subTitle='Actualización en:' icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }}/>}/>
      </Grid>
    </AdminLayout>
  )
}

export default DashboardPage