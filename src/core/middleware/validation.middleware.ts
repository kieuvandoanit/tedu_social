import { NextFunction, Request, Response, RequestHandler } from "express";
import {plainToClass} from 'class-transformer';
import {validate, ValidationError} from "class-validator";
import { Logger } from "@core/utils";
import { HttpException } from "@core/exceptions";

const validationMiddleware = (type: any, skipMissingProperties: boolean): RequestHandler =>{
    return (req: Request, res: Response, next: NextFunction)=>{
        validate(plainToClass(type, req.body), {skipMissingProperties}).then((errors: ValidationError[]) =>{
            if(errors.length > 0){
                Logger.error(errors);
                const message = errors.map((error: ValidationError) =>{
                    Object.values(error.constraints!);
                }).join(", ");
                next(new HttpException(400, message));
            }
        });
    }
}

export default validationMiddleware;