import React, { useState } from "react";
import { TabBarProps, TabProps } from "../../types";
import { Tabs } from "@material-ui/core";
import TabItem from "./Tab";

const TabBar: React.FC<TabBarProps> = ({ tabItems, selectionHandler }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  
  // NOTE: Update this so that selection handler utilizes a string id.
  // an explicit click handler allow utilization of TabItem prop values.
  const clickHandlerFactory = (id: string, index: number) => () => {
    if (selectedIndex !== index)
      selectionHandler(id);
  };

  const handleChange = (_event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
    setSelectedIndex(newValue);
  };

  return (
    <Tabs
     value={ selectedIndex }
     onChange={ handleChange }
    >
      {
        tabItems.map((item: Omit<TabProps, "clickHandler">, index: number) => TabItem({ clickHandler: clickHandlerFactory(item.id, index), ...item }))
      }
    </Tabs>
  );
};

export default TabBar;