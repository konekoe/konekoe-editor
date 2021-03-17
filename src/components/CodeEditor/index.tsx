import React, { createRef, useLayoutEffect, useState, useEffect } from "react";
import ace, { Ace } from "ace-builds";
import { CodeEditorProps, ExerciseFileDict, EditSessionDict } from "../../types";
import TabBar from "../TabBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { filesToEditSessions, filesToTabItems, createFileSubmission } from "./utils";
import { Grid, Button, Backdrop } from "@material-ui/core";
import { submit } from "../../state/submissionsSlice";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
      position: "absolute"
    },
    container: {
      position: "relative"
    }
  }),
);
// Set base path for fetching themes.
ace.config.set(
  "basePath", 
  "https://cdn.jsdelivr.net/npm/ace-builds@1.4.3/src-noconflict/"
);

const CodeEditor: React.FC<CodeEditorProps> = ({ exerciseId }) => {
  const classes = useStyles();
  const [editor, setEditor] = useState<Ace.Editor | undefined>();
  const [editorSessions, setEditorSessions] = useState<EditSessionDict>({});
  const [activeSession, setActiveSession] = useState<string>("");

  // Fetch active files from store.
  const editorContent: ExerciseFileDict = useSelector((state: RootState) => state.submissions.activeSubmissions[exerciseId] || {});

  const submissionRequestExists: boolean = useSelector((state: RootState) => state.submissions.submissionRequests[exerciseId] !== undefined);

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
    setActiveSession(Object.keys(editorContent)[0]);
  }, [editorContent]);

  useEffect(() => {
    if (!editor)
      return;

    if (activeSession)
      editor.setSession(editorSessions[activeSession]);
    else 
      editor.setValue("No files received.");
    
  }, [editor, editorSessions, activeSession]);

  const handleTabClick = (fileId: string) => {
    setActiveSession(fileId);
    
    if (!editor)
        throw Error("Ace editor has not been configured.");

    editor.setSession(editorSessions[fileId]);
  };

  const handleSubmit = () => {
    if (!submissionRequestExists)
      dispatch(submit({ exerciseId, files: createFileSubmission(editorSessions) }));
  };

  return (
    <div
      className={ classes.container }
    >
      <Backdrop
        open={ submissionRequestExists }
        className={ classes.backdrop }
      >
        Please wait
      </Backdrop>
      <Grid
        container
        direction="row" 
      >
        <Grid
          item
          xs={ 11 }
        >
          <TabBar selectionHandler={ handleTabClick } tabItems={ filesToTabItems(Object.values(editorContent)) }/>
        </Grid>
        <Grid
          item
          xs={ 1 }
        >
          <Button
            className="submit-button"
            variant="contained"
            color="primary"
            disableElevation
            style={{ height: "100%" }}
            onClick={ handleSubmit }
          >
            Submit
          </Button>
        </Grid>

        <Grid
          item
          xs={12}
        >
          <div style={{ width: "100%", height: "10rem"}} ref={ editorRef }/>     
        </Grid>
      </Grid>
    </div>
  );
};

export default CodeEditor;