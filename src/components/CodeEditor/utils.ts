import { EditSession, UndoManager } from "ace-builds";
import { ExerciseFile, EditSessionDict, FileEditSession, FileDataDict, TabItem } from "../../types";
import AceModes from "ace-builds/src-noconflict/ext-modelist";

const filePathRegex = /\.[0-9a-z]+$/i;

// Note: The following eslint rules are disabled as AceModes is a JavaScript module with no typing.

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

export const createEditSession = ({ filename, data, fileId }: ExerciseFile): FileEditSession => {
  const session: FileEditSession = new EditSession(data) as FileEditSession;
  // Exctract file extension
  // If no name is given use "" indicating a text file
  // If the name does not contain a file extension use ""

  // NOTE: filename.match returns an array value or null.

  session.setMode(AceModes.getModeForPath((filePathRegex.exec(filename) || [""])[0]).mode);
  session.filename = filename;
  session.fileId= fileId;
  session.setUndoManager(new UndoManager());
  
  return session;
};

export const filesToEditSessions = (exerciseFiles: ExerciseFile[]): EditSessionDict => (
  exerciseFiles.reduce((acc: EditSessionDict, curr: ExerciseFile): EditSessionDict => {
  acc[curr.fileId] = createEditSession(curr);
  return acc;
}, {}));

export const filesToTabItems = (exerciseFiles: ExerciseFile[]): TabItem[] => exerciseFiles.map((file: ExerciseFile): TabItem => ({
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