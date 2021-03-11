import React, { useState } from "react";
import { Provider } from "react-redux";
import store from "./state/store";
import { Container, Grid, Paper } from "@material-ui/core";
import TabBar from "./components/TabBar";
import { TabItem } from "./types";
import InfoBox from "./components/InfoBox";
import CodeTerminal from "./components/CodeTerminal";

const testTabItems: TabItem[] = [
  {
    label: "test1",
    id: "test1",
  },
  {
    label: "test2",
    id: "test2",
    points: {
      receivedPoints: 1,
      maxPoints: 10
    }
  }
];

const testDescriptions: Record<string, string> = {
  "test1": `
    # Hello

    This is a test description
  `,
  "test2": `
    * List item 1
    * List item 2
  `
};

const App: React.FC = () => {
  const [selectedExercise, setSelectedExercie] = useState<string>(testTabItems[0].id);
  
  const tabSelectionHandler = (id: string) => {
    setSelectedExercie(id);
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
            <CodeTerminal exerciseId="test1" terminalId="test1">

            </CodeTerminal>
          </Grid>
        </Grid>
      </Container>
    </Provider>
  );
}

export default App;