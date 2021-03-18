import React, { createRef, useLayoutEffect, useEffect, useState } from "react";
import { Terminal }  from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { CodeTerminalProps, TerminalOutputDictionary } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { clearTerminal } from "../../state/terminalSlice";
import "xterm/css/xterm.css";
import { Button } from "@material-ui/core";
import { generateUuid } from "../../utils";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const TERMIAL_PREFIX = "terminal";

const useStyles = makeStyles((theme: Theme) =>
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

const CodeTerminal: React.FC<CodeTerminalProps> = ({ terminalId, exerciseId }) => {
  const classes = useStyles();

  const terminalContent: TerminalOutputDictionary = useSelector((state: RootState) => state.terminals.output);
  const [id, setId] = useState<string>("");
  const [terminal] = useState<Terminal>(new Terminal());
  const [fitAddon] = useState<FitAddon>(new FitAddon());
  const dispatch = useDispatch();
  const terminalRef = createRef<HTMLDivElement>();


  
  useLayoutEffect(() => {
    if (terminalRef.current) {
      // Set up xterm instance.
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);
      setId(terminalId || generateUuid(TERMIAL_PREFIX));

      try {
        fitAddon.fit();
      }
      catch (error) {
        console.log((error as Error).message);
      }
    }

    return () => {
      terminal.dispose();
    }

  }, []);

  useEffect(() => {
    if (terminalContent[exerciseId] && terminalContent[exerciseId][id]) {
      terminal.reset();
      terminal.write(terminalContent[exerciseId][id]);
    }
  }, [terminalContent[exerciseId]]);

  const handleClearClick = () => {
    if (terminalRef.current) {
      terminal.reset();
      dispatch(clearTerminal({ exerciseId, terminalId: id }));
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