import * as ace from "ace-builds/src-noconflict/ace";
import { ExerciseFile, EditSessionDict, FileEditSession, ExerciseFileDict, FileData, FileDataDict } from "../../types";
import AceModes from "ace-builds/src-noconflict/ext-modelist";

export const createEditSession = ({ filename, data, fileId }: ExerciseFile): FileEditSession => {
  const session = new ace.EditSession(data);
  // Exctract file extension
  // If no name is given use "" indicating a text file
  // If the name does not contain a file extension use ""

  // NOTE: filename.match returns an array value or null.

  session.setMode(AceModes.getModeForPath((filename.match(/\.[0-9a-z]+$/i) || [""])[0]).mode);
  session.filename = filename;
  session.fileId= fileId;
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

export const createFileSubmission = (editSessions: EditSessionDict): FileDataDict => Object.values(editSessions)
.reduce((acc, curr) => {
  acc[curr.fileId] = {
   filename: curr.filename,
   data: curr.getDocument().getValue() 
  };

  return acc;
}, {} as FileDataDict);