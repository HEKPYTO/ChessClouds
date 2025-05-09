// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Error } from "./Error";
import type { Outcome } from "./Outcome";

export type ServerMessage = { "kind": "Move", "value": string } | { "kind": "GameEnd", "value": Outcome } | { "kind": "Error", "value": Error } | { "kind": "AuthSuccess" } | { "kind": "MoveHistory", "value": Array<string> } | { "kind": "Pong" };
