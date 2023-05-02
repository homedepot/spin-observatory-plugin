import React, { useState, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { pauseExecutions } from '../../services/gateService';
import './pauseresumebutton.css';

interface IPauseResumeButtonProps {
  executionIds: string[];
}

const options = [
  { text: 'Pause', action: pauseExecutions },
  { text: 'Resume', action: () => {} },
];

export const PauseResumeButton = ({ executionIds }: IPauseResumeButtonProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleButtonClick = () => {
    console.log(`You clicked ${options[selectedIndex].text}`);
    console.log(`Executing ${options[selectedIndex].action.name}`);
  };

  const handleMenuItemClick = (idx: number) => (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setSelectedIndex(idx);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup variant="contained" ref={anchorRef}>
          <Button onClick={handleButtonClick}>{options[selectedIndex].text}</Button>
          <Button size="small" onClick={handleToggle}>
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, idx) => (
                      <MenuItem
                        key={option.text}
                        disabled={idx === 2}
                        selected={idx === selectedIndex}
                        onClick={handleMenuItemClick(idx)}
                      >
                        {option.text}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
};
