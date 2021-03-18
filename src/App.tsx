import React, { useState } from "react";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./state/store";
import { Container, Grid, Paper, Backdrop, Card, CardHeader, CardContent } from "@material-ui/core";
import TabBar from "./components/TabBar";
import { TabItem } from "./types";
import InfoBox from "./components/InfoBox";
import CodeTerminal from "./components/CodeTerminal";
import CodeEditor from "./components/CodeEditor";
import { exerciseTabSelector } from "./state/submissionsSlice";
import { ErrorBoundary } from "react-error-boundary";

const App: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const exerciseTabItems: TabItem[] = useSelector(exerciseTabSelector);

  const tabSelectionHandler = (id: string) => {
    setSelectedExercise(id);
  };

  return (
    <Provider store={ store }>
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
        <Container maxWidth="lg"  >
          <TabBar tabItems={ exerciseTabItems } selectionHandler={ tabSelectionHandler }/>
          <Grid
            container
            direction="column"
            alignItems="center"
          >
            <Grid item>
              <CodeEditor exerciseId="some-exercise1" />
            </Grid>
          </Grid>
        </Container>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;