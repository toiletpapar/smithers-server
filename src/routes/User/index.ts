import express from 'express'
import { getUser } from './get'
import { UserInfo } from '../../models/User'

const userRouter = express.Router()

userRouter.get(
  '/:userId',
  (req, res, next) => {
    if (req.params.userId === 'me') {
      const userInfo: UserInfo = req.user as UserInfo
      req.params.userId = userInfo.userId.toString()
    }

    next()
  },
  getUser
) // Special 'me' parameter to get authenticated user

export {
  userRouter
}