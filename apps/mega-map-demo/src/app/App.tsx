import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import { css } from '@emotion/react';

import { MegaMap } from './MegaMap';

const containerCss = css`
  padding: 20px 0;
`;

export function App() {
  return (
    <Container maxWidth="lg" css={containerCss}>
      <CssBaseline />
      <MegaMap />
    </Container>
  );
}

export default App;
