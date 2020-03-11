import React, { 
  useState,
  useEffect,
} from 'react'
import {  
  useDispatch, 
  useSelector 
} from 'react-redux'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import Grid from '@material-ui/core/Grid'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ComputerIcon from '@material-ui/icons/Computer'
import PersonIcon from '@material-ui/icons/Person'
import PublicIcon from '@material-ui/icons/Public'
import BackspaceIcon from '@material-ui/icons/Backspace'
import Box from '@material-ui/core/Box'
import Divider from '@material-ui/core/Divider'
import {
  not,
  isNil,
  prop,
  drop,
  dropLast,
} from 'ramda'
import { 
  connectModal,
  hide, 
  show,
} from 'redux-modal';
import * as selectors from '../selectors'
import actions from '../actions'
import {
  PlayerType
} from '../constants'
import Slide from '@material-ui/core/Slide';
import makeStyles from '@material-ui/core/styles/makeStyles'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  keyPadButton: {
    fontWeight: 'bold',
    fontSize:'large',
    color: theme.palette.text.secondary,
  },
}))




const JoinRoomDialog = connectModal({name: 'joinRoom', destroyOnHide: false})(props => {
  const { show: isOpen, submit, cancel } = props
  const dispatch = useDispatch()
  const [roomIdText, setRoomIdText] = useState('')
  const error = useSelector(selectors.joinRoomError)
  const classes = useStyles()

  const maxLength = 3
  useEffect(
    () => {
      if(roomIdText.length > maxLength) {
        setRoomIdText(drop(maxLength))
      }
      if(roomIdText.length < maxLength) {
        dispatch(actions.joinRoomError(undefined))
      }
      if(roomIdText.length === maxLength) {
        dispatch(submit(roomIdText))
      }
    }, 
    [roomIdText]
  )

  const handleChange = ({target: { value: roomIdText }}) => {
    setRoomIdText(roomIdText)
  }

  const appendDigit = (digit) => () => {
    setRoomIdText(roomIdText + digit)
  }

  const dropLastDigit = () => {
    setRoomIdText(dropLast(1))
  }


  const onClose = () => {
    setRoomIdText('')
    dispatch(actions.joinRoomError(undefined))
    dispatch(cancel())
  }

  const Key = ({ text, ...props }) => (
    <Grid item justify="center">
      <Button size="large" {...props}>
        <Box className={classes.keyPadButton}> 
          {text}
        </Box>
      </Button>
    </Grid>
  )
  
  const Digit = ({ onClick, digit, ...props }) => (
    <Key onClick={appendDigit(digit)} text={digit} {...props} />
  )

  const NumberPad = (props) => 
    <Grid {...props}>
      <Grid >
        <Grid container>
          <Digit digit={1} />
          <Digit digit={2} />
          <Digit digit={3} />
        </Grid>
      </Grid>
      <Grid item spacing={0}>
        <Grid container>
          <Digit digit={4} />
          <Digit digit={5} />
          <Digit digit={6} />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container>
          <Digit digit={7} />
          <Digit digit={8} />
          <Digit digit={9} />
        </Grid>
      </Grid>
      <Grid item>
        <Grid container>
          <Key onClick={dropLastDigit} text={<BackspaceIcon fontSize='inherit'/>} />
          <Digit digit={0} />
          <Key disabled />
        </Grid>
      </Grid>
    </Grid>

  return (   
    <Dialog open={isOpen} onClose={onClose} TransitionComponent={Transition}>
      <DialogContent>
        <Grid 
          container   
          direction="column"
          justify="center"
          alignItems="center"
          spacing={0}
          >
          <Grid item>
            <TextField 
              type='number'
              pattern="[0-9]*"
              inputmode="numeric"
              variant='outlined'
              color='primary'
              error={not(isNil(error))}
              helperText={prop('reason', error)}
              label={"Game Number"}
              value={roomIdText}
              onChange={handleChange}
              />
          </Grid>
          {/* <NumberPad item/> */}
        </Grid>
      </DialogContent>
    </Dialog>
  )
})


const StartRoomDialog = connectModal({name: 'startRoom', destroyOnHide: false})(props => {
  const { show: isOpen, cancel } = props
  const roomId = useSelector(selectors.roomId)
  const dispatch = useDispatch()

  return (
    <Dialog open={isOpen} onClose={() => dispatch(cancel())} TransitionComponent={Transition} >
      <DialogTitle>Game number is{' '}
        <Box display="inline" fontWeight="bold" color="primary">
          {roomId}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container justify='center'>
          <Grid item>  
            <CircularProgress />
          </Grid>
        </Grid>
        <DialogContentText>
          Waiting for opponent to join...
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
})

const LeaveRoomDialog = connectModal({name: 'leaveRoom', destroyOnHide: false})(props => {
  const { show: isOpen, interceptedAction } = props
  const dispatch = useDispatch()
  const handleLeave = () => {
    dispatch(actions.leaveRoom())
    dispatch(hide('leaveRoom'))
    dispatch(interceptedAction)
  }
  const onClose = () => {
    dispatch(hide('leaveRoom'))
  }
  return (
    <Dialog open={isOpen} onClose={onClose} TransitionComponent={Transition}>
      <DialogTitle>Are you sure you want to leave game?</DialogTitle>
      <DialogContent>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={handleLeave}>
          Leave
        </Button>
      </DialogActions>
    </Dialog>

  )
})

const MenuDialog = connectModal({name: 'menu', destroyOnHide: false})(props => {
  const { show: isOpen,  } = props
  const isOpponentOnline = useSelector(selectors.isOpponentOnline)
  const isSocketNotConnected = useSelector(selectors.isSocketNotConnected)
  const dispatch = useDispatch()
  const onClose = () => {
    dispatch(hide('menu'))
  }
  const guardedDispatch = action => {
    onClose()
    if(isOpponentOnline) {
      dispatch(show('leaveRoom', {interceptedAction: action}))
    } else {
      dispatch(action)
    }
  }

  const handleChangeOpponent = playerType => () => {
    guardedDispatch(actions.changeOpponent(playerType))
  }

  const handleStartRoom = () => {
    guardedDispatch(actions.startRoom())
  }
  
  const handelJoinRoom = () => {
    guardedDispatch(actions.joinRoom())
  }


  return (
    <Dialog open={isOpen} onClose={onClose} TransitionComponent={Transition}>
      <List>
        <ListSubheader>
          <ListItemText primary="Play against a friend"/>
        </ListSubheader>

        <ListItem button disabled={isSocketNotConnected} onClick={handleStartRoom}>
          <ListItemIcon>
            <PublicIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Start Game"/>
        </ListItem>

        <ListItem button disabled={isSocketNotConnected} onClick={handelJoinRoom}>
          <ListItemIcon>
            <PublicIcon fontSize="small" />
          </ListItemIcon>          
          <ListItemText primary="Join Game"/>
        </ListItem>

        <ListItem button onClick={handleChangeOpponent(PlayerType.Offline)}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>          
          <ListItemText primary="Offline"/>
        </ListItem>

        <Divider />

        <ListSubheader>
          <ListItemText primary="Play against a computer"/>
        </ListSubheader>

        <ListItem button onClick={handleChangeOpponent(PlayerType.EasyComputer)}>
          <ListItemIcon>
            <ComputerIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Easy"/>
        </ListItem>
        
        <ListItem button onClick={handleChangeOpponent(PlayerType.MediumComputer)}>
          <ListItemIcon>
            <ComputerIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Medium"/>
        </ListItem>

        <ListItem button onClick={handleChangeOpponent(PlayerType.HardComputer)}>
          <ListItemIcon>
            <ComputerIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Hard"/>
        </ListItem>

      </List>
    </Dialog>
  )
})

const Dialogs =  () => 
  <React.Fragment>
    <MenuDialog />
    <JoinRoomDialog />
    <StartRoomDialog />
    <LeaveRoomDialog />
  </React.Fragment>

export default Dialogs