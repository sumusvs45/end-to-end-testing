import express  from "express"
const userRouter=express.Router()
import { contact, login, register, users } from "../controllers/user.js"
import auth from '../auth/auth.js'
//register
userRouter.post("/register",register)
//login
userRouter.post('/login',login)
//all-users
userRouter.get("/users",users)
//contact-us
userRouter.post("/contact-us",contact)


export default userRouter