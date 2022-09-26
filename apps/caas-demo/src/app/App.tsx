import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import styled from '@emotion/styled';
import { Container } from '@mui/material';

import { NavBar } from './components/NavBar';

import '../reset.css';
import { HomeConnector } from './views/Home/HomeConnector';
import { GameConnector } from './views/Game/GameConnector';

// TODO: try to get this working as children
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeConnector />,
    errorElement: <div>404</div>,
  },
  {
    path: '/game/:gameId',
    element: <GameConnector />,
    errorElement: <div>404</div>,
  },
]);

export function App() {
  return (
    <StyledApp>
      <NavBar />
      <StyledViewport>
        <RouterProvider router={router} />
      </StyledViewport>
    </StyledApp>
  );
}

export default App;

const StyledApp = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const StyledViewport = styled(Container)`
  padding-top: 20px;
`;
