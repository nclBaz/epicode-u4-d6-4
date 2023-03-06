import Express from "express"
import multer from "multer"
import { extname } from "path"
import { saveUsersAvatars } from "../../lib/fs-tools.js"

const filesRouter = Express.Router()

filesRouter.post("/:userId/single", multer().single("avatar"), async (req, res, next) => {
  // "avatar" here needs to match exactly to the name of the field appended to the FormData object in the FE (or in Postman req body)
  // If they do not match, multer will not find any file
  try {
    console.log("FILE:", req.file)
    console.log("BODY:", req.body)
    const originalFileExtension = extname(req.file.originalname)
    const fileName = req.params.userId + originalFileExtension
    await saveUsersAvatars(fileName, req.file.buffer)

    // Add an avatar field to the corresponding user in users.json file, containing `http://localhost:3001/img/users/${filename}`

    res.send({ message: "file uploaded" })
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/:userId/multiple", multer().array("avatars"), async (req, res, next) => {
  try {
    await Promise.all(req.files.map(file => saveUsersAvatars(file.originalname, file.buffer)))
    console.log("REQ FILES:", req.files)
    res.send({ message: "files uploaded" })
  } catch (error) {
    next(error)
  }
})

export default filesRouter
