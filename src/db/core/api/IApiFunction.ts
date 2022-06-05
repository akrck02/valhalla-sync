import { Request, Response } from "express";
import { AuthDb } from "../classes/AuthDb";

export default interface IApiFunctionSet  {
    [key:string] : Function
}
