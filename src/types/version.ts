type semanticVersionLabels = '-Alpha' | '-Beta' | '';
export type semanticVersionString =
  `${number}.${number}.${number}${semanticVersionLabels}`;
