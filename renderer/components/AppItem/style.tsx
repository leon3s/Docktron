import Styled from 'styled-components';

export const Icon = Styled.img`
  border-radius: 20px;
  width: 40px;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  overflow: hidden;
  user-select: none!important; /* CSS3 */
`;

export const Container = Styled.div`
  width: 40px;
  min-width: 40px;
  max-width: 40px;
  position: relative;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  cursor: pointer;
  margin-bottom: 5px;
  user-select: none !important; /* CSS3 */
  border: 2px solid transparent;
  &:hover {
    border: 2px solid green;
  }
`;

export const CountBadgeContainer = Styled.div`
  position: absolute;
  overflow: visible;
  z-index: 2;
  top: 0px;
  right: 0px;
  user-select: none!important; /* CSS3 */
`;
