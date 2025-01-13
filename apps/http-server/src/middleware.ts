import {Request,Response,NextFunction} from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
const JWT_SECRET = "mysecret"

export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded) {
        if(typeof decoded === "string"){
            res.status(400).json({msg : "you are not logged in"})
            return;
        }
        
        req.userId = (decoded as JwtPayload).id;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}