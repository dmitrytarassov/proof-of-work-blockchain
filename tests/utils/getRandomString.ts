import * as uuid from "uuid";

export function getRandomString(): string {
  return uuid.v1().split("-").join("");
}
