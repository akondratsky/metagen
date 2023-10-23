export type JsonValue = string | number | boolean | JsonObject | JsonArray;

export type JsonObject = {
  [x: string]: JsonValue;
};

export type JsonArray = JsonValue[];
