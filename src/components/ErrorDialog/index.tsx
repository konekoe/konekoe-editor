import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import { ErrorDialogProps } from "../../types";
import { isNumber } from "../../utils/typeCheckers";
import ConditionalBadge from "./ConditionalBadge";

const ErrorDialog: React.FC<ErrorDialogProps> = ({ open, title, message, numOfRemainingErrors, closeHandler }) => (
  <Dialog open={ open }>
    <DialogTitle>
      { title }
    </DialogTitle>
    <DialogContent>
      <ConditionalBadge
        badgeContent={ numOfRemainingErrors }
        color={ "error" }
      >
        <DialogContentText>
          { message }
        </DialogContentText>
      </ConditionalBadge>  
    </DialogContent>
    <DialogActions>
      <Button
        onClick={ closeHandler }
      >
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default ErrorDialog;