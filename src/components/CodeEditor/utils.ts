import * as ace from "ace-builds/src-noconflict/ace";
import { ExerciseFile, EditSessionDict } from "../../types";
import { Ace } from "ace-builds";
import AceModes from "ace-builds/src-noconflict/ext-modelist";

export const createEditSession = ({ filename, data }: ExerciseFile): Ace.EditSession => {
  const session = new ace.EditSession(data);

  // Exctract file extension
  // If no name is given use "" indicating a text file
  // If the name does not contain a file extension use ""

  // NOTE: filename.match returns an array value or null.
  session.setMode(AceModes.getModeForPath((filename.match(/\.[0-9a-z]+$/i) || [""])[0]).mode);
  session.filename = filename;
  session.setUndoManager(new ace.UndoManager());
  
  return session;
};

export const filesToEditSessions = (exerciseFiles: ExerciseFile[]): EditSessionDict => (
  exerciseFiles.reduce((acc: EditSessionDict, curr: ExerciseFile): EditSessionDict => {
  acc[curr.fileId] = createEditSession(curr);
  return acc;
}, {}));

export const filesToTabItems = (exerciseFiles: ExerciseFile[]) => exerciseFiles.map((file: ExerciseFile) => ({
  label: file.filename,
  id: file.fileId
}));