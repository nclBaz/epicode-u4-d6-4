// const express = require("express") OLD IMPORT SYNTAX
import Express from "express" // NEW IMPORT SYNTAX (We can use it only if we add "type": "module", to package.json)
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"
import usersRouter from "./api/users/index.js"
import booksRouter from "./api/books/index.js"
import filesRouter from "./api/files/index.js"
import { genericErrorHandler, badRequestHandler, unauthorizedHandler, notfoundHandler } from "./errorsHandlers.js"

const server = Express()
const port = process.env.PORT || 3001
const publicFolderPath = join(process.cwd(), "./public")

console.log(process.env.MONGO_URL)
console.log(process.env.SECRET)

// ************************** GLOBAL MIDDLEWARES *********************

server.use(Express.static(publicFolderPath))
server.use(cors())
server.use(Express.json()) // If you don't add this line BEFORE the endpoints all request bodies will be UNDEFINED!!!!!!!!!!!!!!!

// ************************** ENDPOINTS ***********************
server.use("/users", usersRouter)
server.use("/books", booksRouter)
server.use("/files", filesRouter)

// ************************* ERROR HANDLERS *******************
server.use(badRequestHandler) // 400
server.use(unauthorizedHandler) // 401
server.use(notfoundHandler) // 404
server.use(genericErrorHandler) // 500 (this should ALWAYS be the last one)

// mongo.connect(process.env.MONGO_URL)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}`)
})
