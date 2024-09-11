import React from 'react';
import { createStyles, makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';

const useStyles = makeStyles(theme =>
  createStyles({
    messageRow: {
      display: 'flex',
    },
    messageRowRight: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    messageBlue: {
      position: 'relative',
      marginLeft: '20px',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#D4E6D3', // Soft Sage Green
      width: '60%',
      textAlign: 'left',
      font: "400 .9em 'Open Sans', sans-serif",
      color: '#333333', // Dark Charcoal for font
      border: '1px solid #A0C1B8', // Slightly darker green for border
      borderRadius: '10px',
      '&:after': {
        content: "''",
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '15px solid #D4E6D3', // Soft Sage Green
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        top: '0',
        left: '-15px',
      },
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '17px solid #A0C1B8', // Slightly darker green for the before pseudo-element
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        top: '-1px',
        left: '-17px',
      },
    },
    messageOrange: {
      position: 'relative',
      marginRight: '20px',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#F0F0F0', // Light Warm Gray
      width: '60%',
      textAlign: 'left',
      font: "400 .9em 'Open Sans', sans-serif",
      color: '#3A3D62', // Dark Slate Blue for font color
      border: '1px solid #D3D3D3', // Slightly darker gray for border
      borderRadius: '10px',
      '&:after': {
        content: "''",
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '15px solid #F0F0F0', // Light Warm Gray for after pseudo-element
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        top: '0',
        right: '-15px',
      },
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '17px solid #D3D3D3', // Slightly darker gray for before pseudo-element
        borderLeft: '16px solid transparent',
        borderRight: '16px solid transparent',
        top: '-1px',
        right: '-17px',
      },
    },

    messageContent: {
      padding: 0,
      margin: 0,
    },
    messageTimeStampRight: {
      position: 'absolute',
      fontSize: '.85em',
      fontWeight: '300',
      marginTop: '10px',
      bottom: '-3px',
      right: '5px',
    },

    orange: {
      color: '#ffb74d',
      backgroundColor: deepOrange[500],
      width: '32px',
      height: '32px',
    },
    avatarNothing: {
      color: 'transparent',
      backgroundColor: 'transparent',
      width: '32px',
      height: '32px',
    },
    displayName: {
      marginLeft: '20px',
      color: '#333333',
    },
  }),
);

export const MessageLeft = props => {
  const message = props.message ? props.message : 'no message';
  const timestamp = props.timestamp ? props.timestamp : '';
  const photoURL = props.photoURL ? props.photoURL : 'dummy.js';
  const displayName = props.displayName ? props.displayName : 'no name';
  const classes = useStyles();
  return (
    <>
      <div className={classes.messageRow}>
        <Avatar alt={displayName} className={classes.orange} src={photoURL}></Avatar>
        <div>
          <div className={classes.displayName}>{displayName}</div>
          <div className={classes.messageBlue}>
            <div>
              <p className={classes.messageContent}>{message}</p>
            </div>
            <div className={classes.messageTimeStampRight}>{timestamp}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export const MessageRight = props => {
  const classes = useStyles();
  const message = props.message ? props.message : 'no message';
  const timestamp = props.timestamp ? props.timestamp : '';
  return (
    <div className={classes.messageRowRight}>
      <div className={classes.messageOrange}>
        <p className={classes.messageContent}>{message}</p>
        <div className={classes.messageTimeStampRight}>{timestamp}</div>
      </div>
    </div>
  );
};
