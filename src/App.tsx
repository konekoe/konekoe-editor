import React, { useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./state/store";
import { Container, Grid, Paper, Backdrop, Card, CardHeader, CardContent } from "@material-ui/core";
import TabBar from "./components/TabBar";
import { TabItem } from "./types";
import InfoBox from "./components/InfoBox";
import CodeTerminal from "./components/CodeTerminal";
import CodeEditor from "./components/CodeEditor";
import { exerciseTabSelector } from "./state/exerciseSlice";
import { ErrorBoundary } from "react-error-boundary";

const App: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const exerciseTabItems: TabItem[] = useSelector(exerciseTabSelector);
  const exerciseDescription: string = useSelector((state: RootState) => state.exercises.descriptions[selectedExercise] || "No description given");

  useLayoutEffect(() => {
    if (exerciseTabItems.length)
      setSelectedExercise(exerciseTabItems[0].id);
  },[]);

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
    </ErrorBoundary>
  );
}

export default App;