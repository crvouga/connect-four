import React, {
  useRef,
} from 'react';
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
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from '@material-ui/core/Link'
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

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
import actions from '../actions'


const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: blue,
  },
  [Player.One]: red[600],
  [Player.Two]: yellow[600],
})

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: blue,
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

import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';

const App = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const notifications = useSelector(selectors.notifications)
  const theme = useSelector(selectors.theme)

  const handleOpenMenu = () => {
    dispatch(show('menu'))
  }
  const toggleTheme = () => {
    dispatch(actions.toggleTheme())
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
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
            <Tooltip title="Toggle theme">
              <IconButton onClick={toggleTheme}>
                {theme === 'light' ? 
                  <Brightness4Icon fontSize="medium" /> : 
                  <Brightness7Icon fontSize="medium" />}
              </IconButton>
            </Tooltip>
            <Link 
              href="https://github.com/crvouga/connect-four" 
              underline="none" 
              color="inherit"
              >
              <Tooltip title="GitHub repository">
                <IconButton>
                  <GitHubIcon fontSize="medium" />
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
