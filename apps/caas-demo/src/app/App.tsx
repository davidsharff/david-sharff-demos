import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import styled from '@emotion/styled';
import { Container } from '@mui/material';

import { Home } from './views/Home/Home';
import { NavBar } from './components/NavBar';

import '../reset.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,

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
