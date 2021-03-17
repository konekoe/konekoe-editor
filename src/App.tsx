import React, { useState } from "react";
import { Provider } from "react-redux";
import store from "./state/store";
import { Container, Grid, Paper } from "@material-ui/core";
import TabBar from "./components/TabBar";
import { TabItem } from "./types";
import InfoBox from "./components/InfoBox";
import CodeTerminal from "./components/CodeTerminal";
import CodeEditor from "./components/CodeEditor";

const App: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<string>(testTabItems[0].id);
  
  const tabSelectionHandler = (id: string) => {
    setSelectedExercise(id);
  };

  return (
    <Provider store={ store }>
      <Container maxWidth="lg"  >
        <TabBar tabItems={ testTabItems } selectionHandler={ tabSelectionHandler }/>
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
    </Provider>
  );
}

export default App;