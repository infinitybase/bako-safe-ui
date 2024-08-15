import { keyframes } from '@emotion/react';

const shakeAnimationY = keyframes`
    0% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-2px);
    }
    50% {
        transform: translateY(2px);
    }
    75% {
        transform: translateY(-2px);
    }
    100% {
        transform: translateY(0);
    }
`;

const shakeAnimationX = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

export { shakeAnimationY, shakeAnimationX };
