import {createMachine, interpret, assign} from 'xstate'

type User = {
  name: string,
  email: string,
  password?: string,
}
interface Context {
  auth?: undefined;
  user?: User;
  error: undefined;
}
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

const requestPassword = (email) =>
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

const authenticate = (email, password) =>
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

/**
 * Type definitions
 */
export const Events = {
  SUBMIT: 'SUBMIT',
  CANCEL: 'CANCEL',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  RESET_PASSWORD: 'RESET_PASSWORD',
  INPUT_EMAIL: 'INPUT_EMAIL',
  INPUT_PASSWORD: 'INPUT_PASSWORD',
  LOGOUT: 'LOGOUT',
}

/**
 * Helper functions
 */
const testEmailEventType = (event) =>
  event.type === Events.SUBMIT ||
  event.type === Events.RESET_PASSWORD ||
  event.type === Events.INPUT_EMAIL

/**
 * Guard Functions
 * - Test that a condition is true or false in a given context and / or for a given event
 * - Are used to effect a transition *if condition = true*
 */

const guardFunctions = {
  isNoEmail: (context, event) => {
    const eventType = testEmailEventType(event)
    return eventType && context.email.length === 0
  },
  isEmailMinLength: (context, event) => {
    return context.email.length > 5 // fake test
  },
  isPasswordMinLength: (context, event) => {
    return context.password.length > 0 // fake test
  },
  isEmailBadFormat: (context, event) => {
    const eventType = testEmailEventType(event)
    return eventType && context.email.length > 0 /*&& !isEmail(context.email)*/
  },
  isNoPassword: (context, event) => event.type === Events.SUBMIT && context.password.length === 0,
  isPasswordShort: (context, event) => event.type === Events.SUBMIT && context.password.length < 5,
  isSignInEmailSent: (context, event) => event.data.code === 0,
  isPasswordRecoveryEmailSent: (context, event) => event.data.code === 1,
  isLoginFailed: (context, event) => event.data.code === 2,
  isNoResponse: (context, event) => event.data.code === 3,
  isInternalServerErr: (context, event) => event.data.code === 4,
}

/**
 * Parametrized Actions
 * Actions are machine function calls that produce a side-effect
 * - assign() returns an object that specifies what the action has to be
 * - machine actions use the object returned by assign() to apply the side-effect
 */

const formActions = {
  cacheEmail: assign((context, event) => ({
    user: {
      email: event.data.email,
    },
  })),
  cachePassword: assign((context, event) => ({
    user: {
      password: event.data.password,
    },
  })),
  onLoginFailed: assign((context, event) => ({
    error: event.data.error,
  })),
  onSuccess: assign((context, event) => {
    alert('🎉 Signed in')
  }),
  isPasswordRecoveryEmailSent: assign((context, event) => {
    alert(
      '💌  If that email address is in our database, we will send you an email to reset your password.',
    )
    return {
      email: '',
      password: '',
    }
  }),
}

/**
 * Mock form actions produce a side-effect on the ui
 * TODO : replace by actual component handler functions
 */
const mockUiActions = {
  handleEmailInputFocus: assign(() => console.log('Focus on email input')),
  handlePasswordInputFocus: assign(() => console.log('Focus on password input')),
  handleSubmitButtonFocus: assign(() => console.log('Focus on submit button ')),
}

/**
 * Service invocation functions
 * - call function in a child machine
 * - setup the invoking function (the parent machine) to wait for the resolution of the call in the child
 */
const serviceFunctions = {
  authenticate: (context, event) => {
    console.log('event')
    console.log(event)
    console.log('context')
    console.log(context)
    return authenticate(event.data?.email, event.data?.password)
  },
  // requestNewPassword: (context, event) => requestPassword(context.email),
  requestNewPassword: (context, event) => {
    console.log('event.type')
    console.log(event.type)
    return requestPassword(event.data?.email)
  },
}

const machineOptions: any = {
  actions: {
    ...mockUiActions,
    ...formActions,
  },
  guards: {
    ...guardFunctions,
  },
  services: {
    ...serviceFunctions,
  },
}

// create a state machine config
const config = {
  id: 'auth',
  initial: 'authenticating',
  context: {
    auth: undefined,
    user: undefined,
    error: undefined,
  },
  states: {
    authenticating: {
      id: 'checkAuth',
      invoke: {
        src: 'authenticate',
        onDone: 'signedIn',
        onError: {
          target: 'signedOut',
          actions: 'onLoginFailed',
        },
      },
    },
    reset: {
      id: 'resetPwd',
      invoke: {
        src: 'requestNewPassword',
        onDone: {target: 'signedOut', actions: 'isPasswordRecoveryEmailSent'},
        onError: {
          target: 'signedOut',
          actions: 'onLoginFailed',
        },
      },
    },
    signingIn: {},
    signingOut: {},
    signedIn: {
      on: {LOGOUT: 'signedOut'},
    },
    signedOut: {
      on: {LOGIN: 'authenticating', RESET_PASSWORD: 'reset'},
    },
  },
}

// create a machine instance from config
const authMachine = createMachine(config, machineOptions)

// create an instance of an interpreted machine,
// also known as a service.

//const service = interpret(authMachine);

// start our service
/*
service.start();

service.state.value === "signedOut";
// true

// send an event that initiates a state transition
// to the 'authenticating' state
service.send("LOGIN");

service.state.matches("authenticating");
// true

service.send("SUCCESS");

service.state.matches("signedIn");
// true

service.stop();
*/
