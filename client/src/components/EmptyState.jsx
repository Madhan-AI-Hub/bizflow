import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Inbox } from '@mui/icons-material';

const EmptyState = ({ icon: Icon = Inbox, title, message, actionLabel, onAction }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 10,
        px: 2,
        textAlign: 'center'
      }}
    >
      <Box sx={{ 
          width: 100, 
          height: 100, 
          borderRadius: '50%', 
          bgcolor: 'rgba(0, 237, 100, 0.05)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          mb: 3
      }}>
        <Icon sx={{ fontSize: 40, color: '#00ED64' }} />
      </Box>
      <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 700, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 450 }}>
        {message}
      </Typography>
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          sx={{ 
              px: 4, 
              py: 1, 
              fontWeight: 700,
              bgcolor: '#00ED64',
              color: '#001E2B',
              '&:hover': { bgcolor: '#00DA5C' }
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
