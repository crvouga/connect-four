import React, {
  useEffect,
} from 'react';
import { 
  useSelector  
} from 'react-redux'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import makeStyles from '@material-ui/core/styles/makeStyles'
import {
  ThemeProvider
} from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import yellow from '@material-ui/core/colors/yellow'
import blue from '@material-ui/core/colors/blue'
import {
  not
} from 'ramda'
import { 
  Player 
} from "../constants";
import * as selectors from '../selectors'
import Menu from './Menu'
import Button from './Button'
import Message from './Message'
import Board from './Board'
import Dialogs from './Dialogs'
import Notifications from 'react-notification-system-redux'



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
    padding: 0,
  },
}))



const App = () => {
  const classes = useStyles()
  const notifications = useSelector(selectors.notifications)
  const isOpponentOnline = useSelector(selectors.isOpponentOnline)
  
  /* handles page refresh during online game */
  useEffect(
    () => {
      window.onbeforeunload = (e) => {
        if(not(isOpponentOnline)) {
          e.preventDefault()
        } else {
          e.returnValue = ''
        }
      }
    },
    [isOpponentOnline]
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Dialogs />
      <Notifications notifications={notifications} />
      <Container maxWidth="xs" className={classes.root} >
        <Menu />
        <Message />
        <Board />
        <Button />
      </Container>
    </ThemeProvider>
  )
}

export default App
