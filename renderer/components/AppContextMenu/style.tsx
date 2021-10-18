import Styled from 'styled-components';

interface IContainerProps {
  posX:number;
  posY:number;
}

export const Container = Styled.div<IContainerProps>`
  padding: 4px;
  background-color: white;
  border-radius: 2px;
  position:absolute;
  z-index: 920;
  top: ${props => props.posY}px;
  left: ${props => props.posX - 100}px;
`;

export const MenuList = Styled.div`
  display: flex;
  width: 100px;
  flex-direction: column;
`;

export const MenuOption = Styled.div`
  padding: 4px;
  font-size: 12px;
  border-bottom: 1px solid ${props => props.theme.borderColorDefault};
  cursor: pointer;
  border-radius: 2px;
  :last-child {
    border-bottom: 0px;
  }
  :hover {
    background-color: rgba(0, 0, 0, 0.4);
  }
`;

export const Backdrop = Styled.div`
  width: 100%;
  height: 100%;
  position:fixed;
  top: 0px;
  left:0px;
  z-index:100;
`;
