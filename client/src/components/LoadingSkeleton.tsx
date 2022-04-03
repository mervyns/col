import { Box, Skeleton, Typography } from '@mui/material';

import React from 'react';

const LoadingSkeleton: React.VFC = () => {
  return (
    <Box sx={{ width: 300 }}>
      <Skeleton variant="rectangular" width={300} height={188} />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Skeleton animation="wave" />
      <Typography>
        Please enjoy the soothing animation whilst we load the page for you
      </Typography>
    </Box>
  );
};

export default LoadingSkeleton;
