import React from "react";
import marked from "marked";
import sanitizeHtml from "sanitize-html";
import { InfoBoxProps } from "../../types";

const InfoBox: React.FC<InfoBoxProps> = ({ content }) => (
  <article dangerouslySetInnerHTML={ { __html: sanitizeHtml(marked(content)) } } />
);

export default InfoBox;