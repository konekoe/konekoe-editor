import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, Store } from "./state/store";
import { Container, Grid, Backdrop, Card, CardHeader, CardContent, LinearProgress } from "@material-ui/core";
import TabBar from "./components/TabBar";
import { TabItem } from "./types";
import InfoBox from "./components/InfoBox";
import CodeTerminal from "./components/CodeTerminal";
import CodeEditor from "./components/CodeEditor";
import { exerciseTabSelector } from "./state/exerciseSlice";
import { ErrorBoundary } from "react-error-boundary";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import WebSocketMessageHandler from "./utils/WebSocketMessageHandler";

const useStyles = makeStyles(() =>
  createStyles({
    waitScreen: {
      position: "relative",
      height: "50vh"
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
      {
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