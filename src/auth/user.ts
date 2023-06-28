interface User {
  user_id: string; // username
  password_hash: string;
  lockout: boolean;
}

interface UserInfo {
  userId: string;
  lockout: boolean;
}

export {
  User,
  UserInfo
}