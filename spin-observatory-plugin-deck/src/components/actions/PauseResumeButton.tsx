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
import { pauseExecutions, resumeExecutions } from '../../services/gateService';

interface IPauseResumeButtonProps {
  disabled: boolean;
  executionIds: string[];
  refreshExecutions: () => void;
}

const options = [
  { text: 'Pause', action: pauseExecutions },
  { text: 'Resume', action: resumeExecutions },
];

export const PauseResumeButton = ({ disabled, executionIds, refreshExecutions }: IPauseResumeButtonProps) => {
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

  const isHovered = hover && !disabled;

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
            width: '7rem',
            color: 'white',
            backgroundColor: isHovered ? 'var(--button-primary-hover-bg)' : 'var(--color-accent)',
          }}
          onClick={handleButtonClick}
        >
          {options[selectedIndex].text}
        </Button>
        <Button
          style={{
            color: 'white',
            backgroundColor: isHovered ? 'var(--button-primary-hover-bg)' : 'var(--color-accent)',
          }}
          size="small"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
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
