import {createMachine, interpret, assign} from 'xstate'

type User = {
  name: string,
  email: string,
}
interface Context {
  auth?: undefined;
  user?: User;
  error: undefined;
}
// response code 0 - sign in success
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
        resolve({code: 1, payload: {email}})
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
        resolve({
          code: 0,
          payload: {user: {name: 'mister T', email: 'admin@admin.com'}},
        })
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

const MESSAGE = {
  0:
    '💌  If that email address is in our database, we will send you an email to reset your password.',
  1: '🎉 Sign in successful!',
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
  isValidEmail: (context, event) => {
    return event.data?.email.length > 5
  },
  isValidPassword: (context, event) => {
    return event.data?.password.length > 4
  },
  isNoEmail: (context, event) => {
    return event.data?.email.length === 0
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
}

/**
 * Parametrized Actions
 * Actions are machine function calls that produce a side-effect
 * - assign() returns an object that specifies what the action has to be
 * - machine actions use the object returned by assign() to apply the side-effect
 */

const formActions = {
  cacheEmail: assign({
    user: {
      ...(context, event) => context.user,
      email: (context, event) => event.data?.email,
    }
  }),
  cachePassword: assign({
    user: {
      ...(context, event) => context.user,
      password: (context, event) => event.data?.password,
    }
  }),
  setAuth: assign({
    auth: (context, event) => event.data?.code,
  }),
  setUser: assign({
    user: (context, event) => ({...event.data?.payload, password: undefined}),
  }),
  setError: assign({
    error: (context, event) => event.data,
  }),
  setMessage: assign((context, event) => {
    message: (context, event) => (MESSAGE[event.data?.code]),
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
    return authenticate(context.user?.email, context.user?.password)
  },
  // requestNewPassword: (context, event) => requestPassword(context.email),
  requestNewPassword: (context, event) => {
    console.log('event')
    console.log(event)
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
        onDone: {
          target: 'signedIn',
          actions: ['setAuth', 'setUser'],
        },
        onError: {
          target: 'signedOut',
          actions: 'setError',
        },
      },
    },
    loading: {},
    signingIn: {},
    signingOut: {},
    signedIn: {
      on: {LOGOUT: 'signedOut'},
    },
    signedOut: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            FORGOT_PASSWORD: {
              target: 'forgot',
            },
            INPUT_EMAIL: {
              cond: 'isValidEmail',
              actions: 'cacheEmail',
            },
            INPUT_PASSWORD: {
              cond: 'isValidPassword',
              actions: 'cachePassword',
            },
            LOGIN: [
              {
                cond: 'isNoEmail',
                actions: 'setError',
              },
              {
                cond: 'isEmailBadFormat',
                actions: 'setError',
              },
              {
                cond: 'isNoPassword',
                actions: 'setError',
              },
              {
                target: '#auth.authenticating',
              },
            ],
          },
        },
        forgot: {
          on: {
            INPUT_EMAIL: {
              cond: 'isValidEmail',
              actions: 'cacheEmail',
            },
            RESET_PASSWORD: {
              target: 'reset',
            },
            CANCEL: {
              target: 'idle',
            },
          },
        },
        reset: {
          id: 'resetPwd',
          invoke: {
            src: 'requestNewPassword',
            onDone: {
              actions: 'setMessage',
              target: '#auth.signedOut',
            },
            onError: {
              actions: 'setError',
            },
          },
          on: {
            CANCEL: {
              target: 'forgot',
            },
          },
        },
      },
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
