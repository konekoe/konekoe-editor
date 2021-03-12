import * as ace from "ace-builds/src-noconflict/ace";
import { ExerciseFile, ExerciseFileDict, EditSessionDict } from "../../types";
import { Ace } from "ace-builds";

export const createEditSession = ({ filename, data }: ExerciseFile): Ace.EditSession => {
  const session = new ace.EditSession(data);

  // Exctract file extension
  // If no name is given use "" indicating a text file
  // If the name does not contain a file extension use ""
  //session.setMode(ace.aceModes.getModeForPath(filename.match(/\.[0-9a-z]+$/i) || "").mode);
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