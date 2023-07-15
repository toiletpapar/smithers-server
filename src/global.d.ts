import { UserInfo } from "./models/User"

declare global {
  namespace Express {
    interface User extends UserInfo {}
  }
}