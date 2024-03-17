export interface UserLogin {
  username: string
  password: string
}

export interface UserData {
  name: string
  username: string
  gender: string
  contactInfo: {
    email: string
    phones: string[]
    address: string[]
  }
  roles: string[]
  avatar: {
    key: string
    bucket: string
    url: string
  }
  createAt: string
  updateAt: string
  id: string
}
interface TokenData {
  token: string
  expires: string
  payload: {
    userId: string
    username: string
    type: string
  }
}

export interface UserAndTokenResponse {
  user: UserData
  tokens: {
    access: TokenData
    refresh: TokenData
  }
}
