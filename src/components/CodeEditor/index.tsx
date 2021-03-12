import React, { createRef, useLayoutEffect, useState, useEffect } from "react";
import ace, { Ace } from "ace-builds";
import { CodeEditorProps, ExerciseFileDict } from "../../types";
import TabBar from "../TabBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { filesToEditSessions, filesToTabItems } from "./utils";


const CodeEditor: React.FC<CodeEditorProps> = ({ exerciseId }) => {
  const [editor, setEditor] = useState<Ace.Editor | undefined>();
  const [editorSessions, setEditorSessions] = useState<{ [fileId: string]: Ace.EditSession }>({});
  const [activeSession, setActiveSession] = useState<string>("");

  // Fetch active files from store.
  const editorContent: ExerciseFileDict = useSelector((state: RootState) => state.submissions.activeSubmissions[exerciseId]);

  const dispatch = useDispatch();
  const editorRef = createRef<HTMLDivElement>();

  useLayoutEffect(() => {
    if (editorRef.current) {
      // Create editor sessions for each of the files.
      setEditorSessions(filesToEditSessions(Object.values(editorContent)));
      setActiveSession(Object.keys(editorContent)[0]);
      setEditor(ace.edit(editorRef.current));
    }
  }, []);

  useEffect(() => {
    if (!editor)
      return;

    editor.setTheme("ace/theme/cobalt");

    if (activeSession)
      editor.setSession(editorSessions[activeSession]);
    else 
      editor.setValue("No files received.");
  }, [editor, editorSessions]);

  const handleTabClick = (fileId: string) => {
    setActiveSession(fileId);
    
    if (!editor)
        throw Error("Ace editor has not been configured.");

    editor.setSession(editorSessions[fileId]);
  };

  return (
    <div>
      <TabBar selectionHandler={ handleTabClick } tabItems={ filesToTabItems(Object.values(editorContent)) }/>
      <div ref={ editorRef }/>
    </div>
  );
};

export default CodeEditor;