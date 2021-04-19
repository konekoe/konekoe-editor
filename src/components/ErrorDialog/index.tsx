import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";
import { ErrorDialogProps } from "../../types";
import ConditionalBadge from "./ConditionalBadge";
import { isNumber } from "../../utils/typeCheckers";

const ErrorDialog: React.FC<ErrorDialogProps> = ({ error, numOfRemainingErrors, closeHandler }) => (
  <Dialog open={ error !== undefined }>
    <DialogTitle>
      { (error) ? error.title : "" }
    </DialogTitle>
    <DialogContent>
      <DialogContentText>
        { (error) ? error.message : "" }
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <ConditionalBadge
        badgeContent={ (isNumber(numOfRemainingErrors)) ? numOfRemainingErrors - 1 : numOfRemainingErrors }
        color={ "error" }
      >
        <Button
          onClick={ closeHandler }
        >
          { (isNumber(numOfRemainingErrors) && numOfRemainingErrors > 1) ? "Show next error" : "Close" }
        </Button>
      </ConditionalBadge>
    </DialogActions>
  </Dialog>
);

export default ErrorDialog;