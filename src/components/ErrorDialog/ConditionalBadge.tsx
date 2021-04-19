import React from "react";
import { Badge } from "@material-ui/core";
import { isNumber } from "../../utils/typeCheckers";
import { ConditionalBadgeProps } from "../../types";

const ConditionalBadge: React.FC<ConditionalBadgeProps> = ({ badgeContent, color, children }) => {
  if (isNumber(badgeContent))
    return (
      <Badge
        badgeContent={ badgeContent }
        color={ color }
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        { children }
      </Badge>
    );
  
  return (
    <>
      { children }
    </>
  );
};

export default ConditionalBadge;