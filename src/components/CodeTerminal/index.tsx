import React, { createRef, useLayoutEffect, useEffect, useState } from "react";
import { Terminal }  from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { CodeTerminalProps, TerminalOutputDictionary } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { clearTerminal } from "../../state/terminalSlice";
import "xterm/css/xterm.css";
import { Button } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      backgroundColor: "#000000"
    },
    clearButton: {
      marginLeft: "0.1rem",
      marginBottom: "0.1rem",
    }
  }),
);

const CodeTerminal: React.FC<CodeTerminalProps> = ({ exerciseId }) => {
  const classes = useStyles();

  const terminalContent: TerminalOutputDictionary = useSelector((state: RootState) => state.terminals.output);
  const [terminal] = useState<Terminal>(new Terminal());
  const [fitAddon] = useState<FitAddon>(new FitAddon());
  const dispatch = useDispatch();
  const terminalRef = createRef<HTMLDivElement>();


  
  useLayoutEffect(() => {
    if (terminalRef.current) {
      // Set up xterm instance.
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);
      
      try {
        fitAddon.fit();
      }
      catch (error) {
        console.log((error as Error).message);
      }
    }

    return () => {
      terminal.dispose();
    };

  }, []);

  useEffect(() => {
    if (terminalContent[exerciseId]) {
      terminal.write(terminalContent[exerciseId]);
    }
  }, [terminalContent[exerciseId]]);

  const handleClearClick = () => {
    if (terminalRef.current) {
      terminal.reset();
      dispatch(clearTerminal({ exerciseId }));
    }
  };

  return (
    <div className={ classes.container }>
      <div ref={ terminalRef }>
      </div>
      <Button
       className={ classes.clearButton }
       variant="outlined"
       color="secondary"
       onClick={ handleClearClick }
      >
        Clear
      </Button>
    </div>
  );
};

export default CodeTerminal;