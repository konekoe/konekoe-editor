import React from "react";
import marked from "marked";
import sanitizeHtml from "sanitize-html";
import { InfoBoxProps } from "../../types";

const InfoBox: React.FC<InfoBoxProps> = ({ content }) => (
  <article
    style={ { overflowY: "scroll", maxHeight: "100%" } }
    dangerouslySetInnerHTML={ { __html: sanitizeHtml(marked(content)) } }
  />
);

export default InfoBox;