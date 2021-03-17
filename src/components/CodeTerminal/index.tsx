import React, { createRef, useLayoutEffect, useEffect, useState } from "react";
import { Terminal }  from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { CodeTerminalProps, TerminalOutputDictionary } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { clearTerminal, addTerminalOutput } from "../../state/terminalSlice";
import "xterm/css/xterm.css";
import { Button } from "@material-ui/core";



const CodeTerminal: React.FC<CodeTerminalProps> = ({ terminalId, exerciseId }) => {
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
    }

  }, []);

  useEffect(() => {
    if (terminalContent[exerciseId] && terminalContent[exerciseId][terminalId]) {
      terminal.reset();
      terminal.write(terminalContent[exerciseId][terminalId]);
    }
  }, [terminalContent[exerciseId][terminalId]]);

  const handleClearClick = () => {
    if (terminalRef.current) {
      terminal.reset();
      dispatch(clearTerminal({ exerciseId, terminalId }));
    }
  };

  return (
    <div>
      <Button
       className="clear-button"
       variant="outlined"
       onClick={ handleClearClick }
      >
        Clear
      </Button>
      <div ref={ terminalRef }>
      </div>
    </div>
  );
};

export default CodeTerminal;