import { getRandomNumber } from "./getRandomNumber";
import { getRandomNumberInclusive } from "./getRandomNumberInclusive";

const ports: number[] = [];

export function getPort() {
  let port = getRandomNumberInclusive(20000, 21000);

  while (ports.includes(port)) {
    port = getRandomNumberInclusive(20000, 21000);
  }

  ports.push(port);

  return port;
}
