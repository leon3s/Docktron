import Styled, { keyframes } from 'styled-components';

const LogoAnim = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;


export const Container = Styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
`;

export const Logo = Styled.img`
  width: 60px;
  height: 60px;
  animation-name: ${LogoAnim};
  animation-duration: 2s;
  animation-iteration-count: infinite;
`;

export const Title = Styled.p`
  font-size: 18px;
`;

export const ProgressBar = Styled.progress`
  color: orange;
  ::-webkit-progress-bar {
    background-color: orange;
  }
`;
