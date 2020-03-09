import React, { 
  useState,
} from 'react'
import { 
  useSelector, 
  useDispatch 
} from 'react-redux'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ComputerIcon from '@material-ui/icons/Computer'
import PersonIcon from '@material-ui/icons/Person'
import MenuIcon from '@material-ui/icons/Menu'
import { 
  PlayerType
} from '../constants';
import * as selectors from '../selectors';
import actions from "../actions";

const GameMenu =  () => {
  const isOpponentOnline = useSelector(selectors.isOpponentOnline)
  const isSocketNotConnected = useSelector(selectors.isSocketNotConnected)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const closeMenu = () => {
    setAnchorEl(null)
  }

  const guardedDispatch = action => {
    closeMenu()
    if(isOpponentOnline) {
      dispatch(actions.leaveRoom(action))
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
    <React.Fragment>
      <IconButton onClick={handleOpen}>
        <MenuIcon />
      </IconButton>
      <Menu 
        anchorEl={anchorEl}
        keepMounted
        onClose={closeMenu}
        open={open}
        >
        <MenuItem disabled>
          <ListItemIcon>
            <ComputerIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Play against a computer"/>
        </MenuItem>
        <MenuItem onClick={handleChangeOpponent(PlayerType.EasyComputer)}>
          Easy
        </MenuItem>
        <MenuItem onClick={handleChangeOpponent(PlayerType.MediumComputer)}>
          Medium
        </MenuItem>
        <MenuItem onClick={handleChangeOpponent(PlayerType.HardComputer)}>
          Hard
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Play against a friend"/>
        </MenuItem>
        <MenuItem onClick={handleChangeOpponent(PlayerType.Offline)}>
          Offline
        </MenuItem>
        <MenuItem disabled={isSocketNotConnected} onClick={handleStartRoom}>
          Start Game
        </MenuItem>
        <MenuItem disabled={isSocketNotConnected} onClick={handelJoinRoom}>
          Join Game
        </MenuItem>
      </Menu>
    </React.Fragment>
  )
}

export default GameMenu