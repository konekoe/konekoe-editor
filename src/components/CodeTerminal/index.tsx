import React, { createRef, useLayoutEffect, useEffect } from "react";
import { Terminal }  from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { CodeTerminalProps, TerminalOutputDictionary } from "../../types";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../state/store";
import { clearTerminal } from "../../state/terminalSlice";


const CodeTerminal: React.FC<CodeTerminalProps> = ({ terminalId, exerciseId }) => {
  const terminalContent: TerminalOutputDictionary = useSelector((state: RootState) => state.terminals.output);
  const dispatch = useDispatch();
  const terminalRef = createRef<HTMLDivElement>();

  // Set up xterm instance.
  const _terminal = new Terminal();
  _terminal.loadAddon(new FitAddon());
  
  
  useLayoutEffect(() => {
    if (terminalRef.current) {
      _terminal.open(terminalRef.current);
    }

  }, [terminalRef]);

  useEffect(() => {
    if (terminalContent[exerciseId] && terminalContent[exerciseId][terminalId]) {
      _terminal.write(terminalContent[exerciseId][terminalId]);
    }
  }, [terminalContent]);

  const handleClearClick = () => {
    if (terminalRef.current) {
      _terminal.clear();
      dispatch(clearTerminal({ exerciseId, terminalId }));
    }
  };

  return (
    <div>
      <button
       className="clear-button"
       onClick={ handleClearClick }
      >
        Clear
      </button>
      <div ref={ terminalRef }>
      </div>
    </div>
  );
};

export default CodeTerminal;