import { Request, Response } from "express"

export async function register(req: Request, res: Response) {
  res.json({ message: "Register success" })
}

export async function login(req: Request, res: Response) {
  res.json({ message: "Login success" })
}

export async function logout(req: Request, res: Response) {
  res.json({ message: "Logout success" })
}
