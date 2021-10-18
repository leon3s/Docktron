import Styled from 'styled-components';

export const View = Styled.div`
  height: 15px;
  cursor: pointer;
  min-width: 15px;
  min-height: 15px;
  flex-direction: row;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  padding-horizontal: 2px;
  background-color: red;
`;

export const Text = Styled.p`
  color: white;
  font-weight: bold;
  font-size: 10px;
  text-align: center;
  margin: 0px;
`;
