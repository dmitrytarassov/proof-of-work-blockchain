import * as uuid from "uuid";

export function getRandomString(prefix?: string): string {
  return (prefix || "") + uuid.v1().split("-").join("");
}
