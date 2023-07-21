'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import type {} from '@mui/x-data-grid/themeAugmentation';
import '../../styles/globals.css';

interface tableProps {
  trace: object[];
}
//creating columns for table
const columns: GridColDef[] = [
  { field: 'url', headerName: 'Route/URL', width: 250 },
  {
    field: 'statusCode',
    headerName: 'Status Code',
    width: 150,
    editable: true,
  },
  {
    field: 'method',
    headerName: 'Method',
    width: 150,
    editable: true,
  },
  {
    field: 'fetchKind',
    headerName: 'Fetched From',
    width: 110,
    editable: true,
  },
  {
    field: 'duration',
    headerName: 'Duration (ms)',
    width: 110,
    editable: true,
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 110,
    editable: true,
  },
];

export default function Table(props: tableProps) {
  const { trace } = props;

  return (
    <div className='flex justify-end p-4'>
      <Box
        sx={{
          height: '70vh',
          width: '70vw',
          bgcolor: 'rgba(75,85,99,.5)',
          padding: '24px',
          paddingBottom: '40px',
        }}
      >
        <DataGrid
          sx={{ color: 'white', m: 2 }}
          rows={trace}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </div>
  );
}
