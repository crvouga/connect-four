import React from 'react';
import { 
  useSelector,
  useDispatch,
} from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import makeStyles from '@material-ui/core/styles/makeStyles'
import {
  ThemeProvider
} from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import yellow from '@material-ui/core/colors/yellow'
import blue from '@material-ui/core/colors/blue'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AddToHomeScreenIcon from '@material-ui/icons/AddToHomeScreen'
import CodeIcon from '@material-ui/icons/Code';
import Link from '@material-ui/core/Link'
import Tooltip from '@material-ui/core/Tooltip';

import { 
  Player 
} from "../constants";
import * as selectors from '../selectors'
import GameButton from './Button'
import Feedback from './Feedback'
import Board from './Board'
import Dialogs from './Dialogs'
import Notifications from 'react-notification-system-redux'
import {
  show
} from 'redux-modal'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: blue[200],
      main: blue[600],
      dark: blue[900],
    },
  },
  [Player.One]: red[600],
  [Player.Two]: yellow[600],
})

const useStyles = makeStyles(theme => ({
  root: {
    userSelect: 'none',
    marginTop: theme.spacing(1),
    padding: 0,
  },
}))

const App = () => {
  const classes = useStyles()
  const notifications = useSelector(selectors.notifications)

  const dispatch = useDispatch()
  const handleOpenMenu = () => {
    dispatch(show('menu'))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialogs />
      <Notifications notifications={notifications} />
      <Container maxWidth="xs" className={classes.root} >
        <Grid container justify="space-between">
          <Grid item>
            <IconButton onClick={handleOpenMenu}>
              <MenuIcon fontSize="large"/>
            </IconButton>
          </Grid>
          <Grid item>
            <Link 
              target="_blank"
              rel="noopener"
              href="https://github.com/crvouga/connect-four" 
              underline="none" 
              color="inherit"
              >
              <Tooltip title="Source Code">
                <IconButton>
                  <CodeIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            </Link>
          </Grid>
        </Grid>
        <Feedback />
        <Board />
        <GameButton />
      </Container>
    </ThemeProvider>
  )
}

export default App
