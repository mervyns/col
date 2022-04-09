import { Box, Typography } from '@mui/material';

import React from 'react';

interface Props {
  adminOnly?: boolean;
}
const AccessError: React.VFC<Props> = (props: Props) => {
  return (
    <Box sx={{ m: 'auto' }}>
      <Typography variant="h4">
        This page is only visible to users with Admin
        {!props.adminOnly && ' / Booker'} rights.
      </Typography>
      <Typography variant="h4" sx={{ py: 4 }}>
        Please ensure that you have the proper access rights set up.
      </Typography>
    </Box>
  );
};

export default AccessError;
