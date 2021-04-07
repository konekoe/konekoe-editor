import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import { ErrorDialogProps } from "../../types";
import ConditionalBadge from "./ConditionalBadge";

const ErrorDialog: React.FC<ErrorDialogProps> = ({ error, numOfRemainingErrors, closeHandler }) => (
  <Dialog open={ error !== undefined }>
    <DialogTitle>
      { (error) ? error.title : "" }
    </DialogTitle>
    <DialogContent>
      <ConditionalBadge
        badgeContent={ numOfRemainingErrors }
        color={ "error" }
      >
        <DialogContentText>
          { (error) ? error.message : "" }
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