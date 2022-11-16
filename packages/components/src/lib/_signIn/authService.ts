// response code 0 - sign in email sent
// response code 1 - password recovery email sent, maybe
// response code 2 - login failed
// response code 3 - no response
// response code 4 - internal server error

// OWASP guide to Authentication error responses:
// https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses

const mockApi = {
  isNoResponse: () => Math.random() >= 0.75,
  isNoResponseFake: () => true,
  isLoginFailed: (email, password) => email !== 'admin@admin.com' || password !== 'admin',
  isPasswordRecovery: (email) => ({email}),
  isSignInSuccess: (email) => ({email}),
}

export const requestPassword = (email) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockApi.isNoResponseFake()) {
        reject({code: 3})
      }

      if (mockApi.isPasswordRecovery(email)) {
        resolve({code: 0, payload: {email}})
      }

      resolve(null)
    }, 1500)
  })

export const authenticate = (email, password) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockApi.isLoginFailed(email, password)) {
        reject({code: 2})
      }

      if (mockApi.isNoResponse()) {
        reject({code: 3})
      }

      if (mockApi.isSignInSuccess(email)) {
        resolve({code: 0, payload: {email}})
      }

      // if (isInternalServerErr()) {
      // 	reject({code: 4})
      // }

      resolve(null)
    }, 1500)
  })
