import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import { Box, IconButton, Typography } from '@mui/material'
import React, { FC } from 'react'

interface Props {
  currentValue: number;
  updateQuantity: (quantity: number) => void;
  maxValue: number
}

export const ItemCounter: FC<Props> = ({currentValue, updateQuantity, maxValue}) => {

  const handleOnChangeQuantity = (value: number) => {
    if(value + currentValue > maxValue) return;
    if(value + currentValue === 0) return;

    updateQuantity(value + currentValue);
  }
  
  return (
    <Box display='flex' alignItems={'center'}>
      <IconButton onClick={() => handleOnChangeQuantity(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: 'center' }}> {currentValue} </Typography>
      <IconButton onClick={() => handleOnChangeQuantity(1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}
