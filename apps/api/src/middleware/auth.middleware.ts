import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { config } from "../config"

declare global {
  namespace Express {
    interface Request {
      user?: { userId: number, role: string }
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "unauthorized" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token as string, config.jwt_access_secret) as unknown as { userId: number, role: string }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "invalid token" })
  }
}
