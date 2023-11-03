export type PayloadValue = string | number | boolean | PayloadObject | PayloadArray;

export type PayloadObject = {
  [x: string]: PayloadValue;
};

export type PayloadArray = PayloadValue[];
