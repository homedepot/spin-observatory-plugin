import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import React, { Fragment, useRef, useState } from 'react';
import { gate } from '../../services/';

interface IPauseResumeButtonProps {
  executionIds: string[];
  refreshExecutions: () => void;
}

const options = [
  { text: 'Pause', action: gate.pauseExecutions },
  { text: 'Resume', action: gate.resumeExecutions },
];

export const PauseResumeButton = ({ executionIds, refreshExecutions }: IPauseResumeButtonProps) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hover, setHover] = useState(false);

  const handleButtonClick = () => {
    options[selectedIndex].action(executionIds).then(() => refreshExecutions());
  };

  const handleMenuItemClick = (idx: number) => (_: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
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

  const handleHover = () => setHover((prevHover) => !prevHover);

  const disabled = executionIds.length === 0;

  const computeBtnColor = () => {
    if (disabled) {
      return 'var(--color-status-inactive)';
    } else if (hover) {
      return 'var(--button-primary-hover-bg)';
    } else {
      return 'var(--color-accent)';
    }
  };

  return (
    <Fragment>
      <ButtonGroup
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        variant="contained"
        ref={anchorRef}
        disabled={disabled}
      >
        <Button
          style={{
            color: 'white',
            backgroundColor: computeBtnColor(),
          }}
          size="small"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
        <Button
          style={{
            width: '7rem',
            color: 'white',
            backgroundColor: computeBtnColor(),
          }}
          onClick={handleButtonClick}
        >
          {options[selectedIndex].text}
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'center top',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, idx) => (
                    <MenuItem key={option.text} selected={idx === selectedIndex} onClick={handleMenuItemClick(idx)}>
                      {option.text}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
};
