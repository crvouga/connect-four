import React, { 
  useState 
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
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContentText from '@material-ui/core/DialogContentText'
import Grid from '@material-ui/core/Grid'
import {
  pipe,
  replace,
  take,
  not,
  isNil,
  prop
} from 'ramda'
import { 
  connectModal 
} from 'redux-modal';
import * as selectors from '../selectors'


const JoinRoomDialog = connectModal({name: 'joinRoom'})(props => {
  const { show, submit, cancel } = props
  const dispatch = useDispatch()
  const [roomIdText, setRoomIdText] = useState('')
  const handleSubmit = () => {
    dispatch(submit(roomIdText))
  }
  const handleChange = ({target: { value: roomIdText }}) => {
    setRoomIdText(pipe(replace(/\D/g, ''), take(3))(roomIdText))
  }
  const error = useSelector(selectors.joinRoomError)

  return (
    <Dialog open={show} onClose={() => dispatch(cancel())}>
      <DialogTitle>Join game</DialogTitle>
      <DialogContent>
        <FormControl>
          <TextField 
            type="number"
            inputMode='numeric'
            error={not(isNil(error))}
            helperText={prop('reason', error)}
            placeholder={"What's the game #?"}
            value={roomIdText}
            onChange={handleChange}
            />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={handleSubmit}>
          Join
        </Button>
      </DialogActions>
    </Dialog>
  )
})


const StartRoomDialog = connectModal({name: 'startRoom'})(props => {
  const { show, cancel } = props
  const roomId = useSelector(selectors.roomId)
  const dispatch = useDispatch()

  return (
    <Dialog open={show} onClose={() => dispatch(cancel())} >
      <DialogTitle>Started game #{roomId}</DialogTitle>
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

const LeaveRoomDialog = connectModal({name: 'leaveRoom'})(props => {
  const { show, cancel, confirm } = props
  const dispatch = useDispatch()
  return (
    <Dialog open={show} onClose={() => dispatch(cancel())}>
      <DialogTitle>Are you sure you want to leave game?</DialogTitle>
      <DialogContent>
      </DialogContent>
      <DialogActions>
        <Button color='primary' onClick={() => dispatch(confirm())}>
          Leave
        </Button>
      </DialogActions>
    </Dialog>
  )
})

const Dialogs =  () => {
  return (
    <React.Fragment>
      <JoinRoomDialog />
      <StartRoomDialog />
      <LeaveRoomDialog />
    </React.Fragment>
  )
}

export default Dialogs