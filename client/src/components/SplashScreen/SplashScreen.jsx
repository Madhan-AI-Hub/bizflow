import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: Initial Fade-in & Logo Pulse
    // Stage 1: App Name Entrance
    // Stage 2: Quote Appearance
    // Stage 3: Exit sequence
    
    const timers = [
      setTimeout(() => setStage(1), 800),
      setTimeout(() => setStage(2), 1600),
      setTimeout(() => setStage(3), 3200),
      setTimeout(() => onFinish(), 3800)
    ];

    return () => timers.forEach(t => clearTimeout(t));
  }, [onFinish]);

  return (
    <Box className={`splash-container ${stage === 3 ? 'exit' : ''}`}>
      <Box className="splash-content">
        <Box 
          component="img" 
          src="/bizflow_logo.png" 
          className={`splash-logo ${stage >= 0 ? 'visible' : ''}`}
          alt="BizFlow Logo"
        />
        
        <Typography 
          variant="h2" 
          className={`splash-title ${stage >= 1 ? 'visible' : ''}`}
        >
          BizFlow
        </Typography>
        
        <Typography 
          variant="h6" 
          className={`splash-quote ${stage >= 2 ? 'visible' : ''}`}
        >
          Empowering your business flow, one transaction at a time.
        </Typography>
      </Box>
      
      <Box className="splash-loader">
        <Box className="loader-progress" />
      </Box>
    </Box>
  );
};

export default SplashScreen;
