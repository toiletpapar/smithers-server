import { Request, Response, NextFunction } from 'express'
import { UserRepository } from '../../repositories/UserRepository'
import { User } from '../../models/User'

// Note: No ACL
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Use options model
    const {userId} = await User.validateRequest({userId: req.params.userId}, ['userId'], false)

    if (!userId) {
      // This shouldn't happen
      res.sendStatus(500)
    } else {
      const user = await UserRepository.getById(userId)

      if (user) {
        res.status(200).json(user.serialize())
      } else {
        res.sendStatus(404)
      }
    }
  } catch (err: any) {
    next(err)
  }
}

export {
  getUser
}