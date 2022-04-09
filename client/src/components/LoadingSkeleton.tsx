import { Box, Skeleton, Typography } from '@mui/material';

import React from 'react';

const LoadingSkeleton: React.VFC = () => {
  return (
    <Box sx={{ width: 300, my: 'auto' }}>
      <Skeleton variant="rectangular" width={300} height={188} />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Typography variant="h6" sx={{ py: 3 }}>
        Please enjoy the soothing animation whilst we load the page for you
      </Typography>
    </Box>
  );
};

export default LoadingSkeleton;
