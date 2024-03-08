// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import argsParser from "args-parser";
import * as uuid from "uuid";

import { createApi } from "./api/createApi";
import { Blockchain } from "./blockchain";

const args = argsParser(process.argv);

const nodeAddress = uuid.v1().split("-").join("");

const blockchain = new Blockchain(nodeAddress, args.nodeUrl);

createApi(args.port, args.nodeUrl, blockchain);
