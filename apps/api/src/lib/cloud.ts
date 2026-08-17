import cloudinary from "cloudinary"
import { config } from "../config"
const cloud = cloudinary.v2

cloud.config({
    cloud_name: config.cloude_name,
    api_key: config.cloude_api_key,
    api_secret: config.cloude_api_secert
})

export default cloud