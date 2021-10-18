import Styled from 'styled-components';

export const Container = Styled.div`
  padding: 1px 1px 1px 1px;
  height: 20px;
  display: flex;
  flex-direction: row;
  position: relative;
  background-image: linear-gradient(140deg, rgba(184, 184, 184, 0.4), rgba(255, 255, 255, 0.8));
  box-shadow: -2px 2px 2px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(0, 0, 0, 0.4);
`;

export const HeaderMovable = Styled.div`
  -webkit-user-select: none;
  -webkit-app-region: drag;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Title = Styled.h1`
  margin: 0px;
  padding: 0px;
  color: #59667A;
  font-size: 10px;
  text-algin: center;
`;

export const FaviconContainer = Styled.div`
  width: 40px;
  height: 20px;
  margin: 0px 0px 0px 4px;
  display: flex;
  align-items: center;
  z-index: 942;
  justify-content: flex-start;
`;

export const Favicon = Styled.img`
  width: 14px;
  height: 14px;
  border-radius: 7px;
`;

export const ButtonContainer = Styled.div`
  width: 40px;
  height: 20px;
  margin: 0px 4px 0px 0px;
  display: flex;
  right: 0px;
  z-index: 942;
  align-items: center;
  justify-content: flex-end;
`;

export const Button = Styled.div`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: red;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
`;

