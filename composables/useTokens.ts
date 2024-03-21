export const useTokens = () => {
  const setTokenAuth = (
    token: string,
    refreshToken: string,
    refreshTokenExpireIn: Date | string
  ) => {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('refreshToken', refreshToken)
    sessionStorage.setItem('refreshTokenExpireIn', '' + refreshTokenExpireIn)
  }

  const clearTokenAuth = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('refreshToken')
    sessionStorage.removeItem('refreshTokenExpireIn')
  }

  const getToken = (): string | null => {
    return sessionStorage.getItem('token')
  }
  const getRefreshToken = (): {
    token: string | null
    isExpired: boolean
  } => {
    const expiresIn = sessionStorage.getItem('refreshTokenExpireIn')
    const token = sessionStorage.getItem('refreshToken')
    let isExpired = false
    const timeLeft =
      new Date(Date.now()).getTime() - new Date(expiresIn || 0).getTime()
    if (timeLeft < 0) {
      isExpired = true
    }
    return {
      token,
      isExpired,
    }
  }
  return { setTokenAuth, clearTokenAuth, getToken, getRefreshToken }
}
