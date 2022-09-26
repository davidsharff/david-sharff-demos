import { ReactElement } from 'react';
import { css } from '@emotion/react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

const boxCss = css`
  flex: 1;
`;

export function NavBar(): ReactElement {
  return (
    <Box css={boxCss}>
      <AppBar position="static">
        <Toolbar>
          <h3>Chess as a Service Sandbox</h3>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
