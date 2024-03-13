import { getRandomNumber } from "./getRandomNumber";
import { getRandomNumberInclusive } from "./getRandomNumberInclusive";

const ports: number[] = [];

export function getPort() {
  let port = getRandomNumberInclusive(20000, 30000);

  while (ports.includes(port)) {
    port = getRandomNumberInclusive(20000, 30000);
  }

  ports.push(port);

  return port;
}
