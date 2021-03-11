import React from "react";
import { TabProps, PointsProp } from "../../types";
import { Tab } from "@material-ui/core";
import { isString, isPointsProp } from "../../utils/typeCheckers";

//NOTE: TabItem is not a react component as material ui seems to break if Tab is wrapped in another component.

const processLabel = (label: string, points?: PointsProp) => {
  if (!isString(label) || (points && !isPointsProp(points)))
    throw Error("Malformed tab data.");

  if (points) {
    return `${ points.receivedPoints }/${ points.maxPoints } | ${ label }`;
  }

  return label;
};

const TabItem = ({ label, points, id, clickHandler }: TabProps): React.ReactNode => (
  <Tab key={ id } label={ processLabel(label, points) } onClick={ clickHandler }/>
);

export default TabItem;