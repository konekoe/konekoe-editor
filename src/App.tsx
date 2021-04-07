import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, Store } from "./state/store";
import { Container, Grid, Backdrop, Card, CardHeader, CardContent, LinearProgress, Paper } from "@material-ui/core";
import TabBar from "./components/TabBar";
import { TabItem, CriticalError, MinorError } from "./types";
import InfoBox from "./components/InfoBox";
import CodeTerminal from "./components/CodeTerminal";
import CodeEditor from "./components/CodeEditor";
import { exerciseTabSelector } from "./state/exerciseSlice";
import { ErrorBoundary } from "react-error-boundary";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import WebSocketMessageHandler from "./utils/WebSocketMessageHandler";
import ErrorDialog from "./components/ErrorDialog";
import { popMinorError } from "./state/errorSlice";

const useStyles = makeStyles(() =>
  createStyles({
    waitScreen: {
      position: "relative",
      height: "50vh"
    },
    criticalErrorMessage: {
      color: "red"
    },
    waitScreenContent: {
      position: "absolute",
      top: "50%",
      height: "100%",
      width: "100%",
      textAlign: "center",
    }
  }),
);

const App: React.FC<{ serverAddress: string, token: string, store: Store }> = ({ serverAddress, token, store }) => {
  const classes = useStyles();
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [messageHandler] = useState<WebSocketMessageHandler>(new WebSocketMessageHandler(serverAddress, token, store));
  const exerciseTabItems: TabItem[] = useSelector(exerciseTabSelector);
  const exerciseDescription: string = useSelector((state: RootState) => state.exercises.descriptions[selectedExercise] || "No description given");
  const criticalError: CriticalError | null = useSelector((state: RootState) => state.error.criticalError);
  const minorError: MinorError | undefined = useSelector((state: RootState) => state.error.minorErrors[0]);
  const remainingMinorErrors: number = useSelector((state: RootState) => state.error.minorErrors.length);

  const dispatch = useDispatch();

  useEffect(() => {
    messageHandler.open();
  },[]);

  useEffect(() => {
    if (exerciseTabItems.length && selectedExercise === "") {
      setSelectedExercise(exerciseTabItems[0].id);
    }
      
  },[exerciseTabItems]);

  const tabSelectionHandler = (id: string) => {
    setSelectedExercise(id);
  };

  const errorCloseHandler = (): void => {
    dispatch(popMinorError());
  };

  return (
    <ErrorBoundary
      fallbackRender={ ({ error }) => (
        <Backdrop
        open={ true }
        >
        <Card>
          <CardHeader>
            Unexpected error
          </CardHeader>
          <CardContent>
            { error.message }
          </CardContent>
        </Card> 
        </Backdrop>
      ) }
    >
      <ErrorDialog
        error={ minorError }
        numOfRemainingErrors={ remainingMinorErrors }
        closeHandler={ errorCloseHandler }
      />
      {
      (criticalError) ?
        <Backdrop
          open={ true }
        >
          <Container>
            <h1 className={ classes.criticalErrorMessage }>
              Critical Error
            </h1>
            <Paper>
              { criticalError.message }
            </Paper>
          </Container>
        </Backdrop>
        :
        (selectedExercise) ?
          <Grid
            container
            direction="row"
            alignItems="center"
          >
            <Grid
              item
              xs={ 12 }
            >
              <TabBar tabItems={ exerciseTabItems } selectionHandler={ tabSelectionHandler }/>
            </Grid>
            <Grid
              container
              direction="row"
            >
              <Grid
                item
                xs={ 5 }
              >
                <InfoBox content={ exerciseDescription } />
              </Grid>

              <Grid
                item
                xs={ 7 }
              >
                <Grid
                  container
                  direction="row"
                >
                  <Grid
                    item
                    xs={ 12 }
                  >
                    <CodeEditor exerciseId={ selectedExercise } />
                  </Grid>

                  <Grid
                    item
                    xs={ 12 }
                  >
                    <CodeTerminal exerciseId={ selectedExercise }/>
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
          </Grid>
          :
          <Container className={ classes.waitScreen }>
            <div className={ classes.waitScreenContent }>
              <h1>Just a moment</h1>
              <LinearProgress />
            </div>
          </Container>
      }
      
    </ErrorBoundary>
  );
};

export default App;