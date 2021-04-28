import React, { useState, useLayoutEffect } from "react";
import { TabBarProps, TabProps } from "../../types";
import { Tabs } from "@material-ui/core";
import TabItem from "./Tab";

const TabBar: React.FC<TabBarProps> = ({ tabItems, selectionHandler }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const clickHandlerFactory = (id: string, index: number) => () => {
    if (selectedIndex !== index)
      selectionHandler(id);
  };

  const handleChange = (_event: React.ChangeEvent<Record<string, unknown>>, newValue: number) => {
    setSelectedIndex(newValue);
  };

  // When the tab items change, set the first one as the active tab.
  useLayoutEffect(() => {
    setSelectedIndex(0);
  }, [tabItems]);

  return (
    <Tabs
     value={ Math.min(selectedIndex, Math.max(tabItems.length - 1, 0)) } // When tab items change, the selected index might be out of bounds.
     onChange={ handleChange }
    >
      {
        tabItems.map((item: Omit<TabProps, "clickHandler">, index: number) => TabItem({ clickHandler: clickHandlerFactory(item.id, index), ...item }))
      }
    </Tabs>
  );
};

export default TabBar;