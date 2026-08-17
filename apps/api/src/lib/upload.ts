import multer, { diskStorage } from "multer"

export const uploadProfile = () => multer({ storage: diskStorage({}) }).single("hero")