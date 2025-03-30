import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import ParticleBackground from './ParticleBackground';

// Define animations
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const scaleUp = keyframes`
  from { transform: scale(0.8); }
  to { transform: scale(1); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const WelcomeAnimation = ({ onComplete }) => {
  const [animationState, setAnimationState] = useState('intro'); // 'intro', 'outro', 'hidden'

  useEffect(() => {
    // Set timeout to start outro animation after 2 seconds
    const introTimer = setTimeout(() => {
      setAnimationState('outro');
    }, 2000);

    return () => clearTimeout(introTimer);
  }, []);
  
  useEffect(() => {
    // When outro animation starts, set a timer to complete it
    if (animationState === 'outro') {
      const outroTimer = setTimeout(() => {
        setAnimationState('hidden');
        if (onComplete) onComplete();
      }, 800); // Duration of the outro animation
      
      return () => clearTimeout(outroTimer);
    }
  }, [animationState, onComplete]);

  if (animationState === 'hidden') return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
        zIndex: 9999,
        animation: `${animationState === 'intro' ? fadeIn : fadeOut} ${animationState === 'intro' ? '0.5s' : '0.8s'} ease-out forwards`,
        overflow: 'hidden'
      }}
    >
      {/* Particle Background */}
      <ParticleBackground />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: `${scaleUp} 0.8s ease-out forwards`,
        }}
      >
        {/* Logo or Icon */}
        <Box
          sx={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4caf50, #2196f3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(76, 175, 80, 0.5)',
            mb: 3,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
            }}
          >
            F
          </Typography>
        </Box>

        {/* App Name */}
        <Typography
          variant="h2"
          className="gradient-text"
          sx={{
            fontWeight: 'bold',
            letterSpacing: '1px',
            animation: `${slideUp} 0.8s ease-out forwards`,
            animationDelay: '0.3s',
            opacity: 0,
          }}
        >
          FinSentinal
        </Typography>

        {/* Tagline */}
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: '#aaa',
            animation: `${slideUp} 0.8s ease-out forwards`,
            animationDelay: '0.6s',
            opacity: 0,
          }}
        >
          Advanced Fraud Detection
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomeAnimation;