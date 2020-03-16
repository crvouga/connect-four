import React from 'react';
import { 
  useSelector,
  useDispatch,
} from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import makeStyles from '@material-ui/core/styles/makeStyles'
import {
  ThemeProvider
} from '@material-ui/core/styles'
import { 
  SnackbarProvider 
} from 'notistack';
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import GitHubIcon from '@material-ui/icons/GitHub';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Link from '@material-ui/core/Link'
import * as selectors from '../selectors'
import GameButton from './Button'
import Feedback from './Feedback'
import Board from './Board'
import Dialogs from './Dialogs'
import Notifier from './Notifier'
import {
  show
} from 'redux-modal'
import actions from '../actions'


const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
  },
})

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})

const useStyles = makeStyles(theme => ({
  root: {
    userSelect: 'none',
    marginTop: theme.spacing(1),
    padding: 0,
  },
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    backgroundColor: theme.palette.error.main,
  },
  warning: {
    backgroundColor: theme.palette.warning.main,
  },
  info: {
    backgroundColor: theme.palette.info.main,
  },
}))



const App = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
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
        <SnackbarProvider 
          disableWindowBlurListener 
          preventDuplicate 
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center', }}
          classes={{
            variantSuccess: classes.success,
            variantError: classes.error,
            variantWarning: classes.warning,
            variantInfo: classes.info,
          }}
          >

        <Container maxWidth="xs" className={classes.root} >
          <Dialogs />
          <Notifier />
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
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
