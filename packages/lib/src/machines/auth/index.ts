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

const mockApi = {
  isNoResponse: () => Math.random() >= 0.75,
  isNoResponseFake: () => true,
  isPasswordRecovery: (email) => ({email}),
  isSignInSuccess: (email, password) => email === 'admin@admin.com' || password === 'admin',
}

const requestPassword = (email) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockApi.isNoResponse()) {
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
      if (mockApi.isNoResponse()) {
        reject({code: 3})
      }

      if (mockApi.isSignInSuccess(email, password)) {
        resolve({
          code: 0,
          payload: {user: {name: 'Miss P', email: 'admin@admin.com'}},
        })
      }

      // if (isInternalServerErr()) {
      // 	reject({code: 4})
      // }

      reject({code: 2})
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

// response code 0 - sign in success
// response code 1 - password recovery email sent, maybe
// response code 2 - login failed
// response code 3 - no response
// response code 4 - internal server error

// OWASP guide to Authentication error responses:
// https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses

const MESSAGE = {
  0: '🎉 Sign in successful!',
  1: '💌 If the email address you provided is registered, you should soon receive an email to reset your password',
  2: '☠️ Login failed: please check your email and password ',
  3: '⌛️ The request timed out, please try again later!',
  4: '💩 There was an error on sign in, please try again later!',
  5: 'Please enter your password',
  6: 'Please enter your email',
  7: 'Please enter a valid email',
}

/**
 * Guard Functions
 * - Test that a condition is true or false in a given context and / or for a given event
 * - Are used to effect a transition *if condition = true*
 */

const guardFunctions = {
  isValidEmail: (context, event) => {
    return event.data?.email?.length >= 5
  },

  isValidPassword: (context, event) => {
    return event.data?.password.length > 4
  },

  isErrorEmailEmpty: (context, event) => {
    if (event.data?.email) {
      return event.data?.email.length === 0
    }
    if (context.user?.email) {
      return context.user?.email.length === 0
    }
    return true
  },

  isErrorEmailNotValid: (context, event) => {
    if (event.data?.email) {
      return event.data?.email.length < 5 /*&& !isEmail(context.email)*/
    }
    if (context.user?.email) {
      return context.user?.email.length < 5
    }
    return true
  },

  isErrorPasswordEmpty: (context, event) => {
    if (event.data?.password) {
      return event.data?.password.length === 0 /*&& !isEmail(context.email)*/
    }
    if (context.user?.password) {
      return context.user?.password.length === 0
    }
    return context.user?.password?.length === 0
  },
}

/**
 * Parametrized Actions
 * Actions are machine function calls that produce a side-effect
 * - assign() returns an object that specifies what the action has to be
 * - machine actions use the object returned by assign() to apply the side-effect
 */

const formActions = {
  cacheEmail: assign({
    user: (context, event) => ({
      ...context.user,
      email: event.data?.email,
    }),
  }),
  cachePassword: assign({
    user: (context, event) => ({
      ...context.user,
      password: event.data?.password,
    }),
  }),
  setAuth: assign({
    auth: (context, event) => event.data?.code,
  }),
  setUser: assign({
    user: (context, event) => ({...event.data?.payload, password: undefined}),
  }),
  setApiError: assign({
    error: (context, event) => event.data?.code,
    message: (context, event) => MESSAGE[event.data?.code],
  }),
  setErrorPasswordEmpty: assign({
    error: (context, event) => 5,
    message: (context, event) => MESSAGE[5],
  }),
  setErrorEmailEmpty: assign({
    error: (context, event) => 6,
    message: (context, event) => MESSAGE[6],
  }),
  setErrorEmailNotValid: assign({
    error: (context, event) => 7,
    message: (context, event) => MESSAGE[7],
  }),
  setSuccess: assign({
    error: undefined,
    message: (context, event) => MESSAGE[event.data?.code],
  }),
  clearAuth: assign({
    auth: undefined,
  }),
  clearUser: assign({
    user: undefined,
  }),
  clearPassword: assign({
    user: (context, event) => ({
      ...context.user,
      password: undefined,
    }),
  }),
  clearError: assign({
    error: undefined,
    message: undefined,
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
    return authenticate(context.user?.email, context.user?.password)
  },
  // requestNewPassword: (context, event) => requestPassword(context.email),
  requestNewPassword: (context, event) => {
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
const emailStates = {
  initial: 'noError',
  states: {
    noError: {},
    error: {
      initial: 'empty',
      states: {
        empty: {},
        notValid: {},
      },
      onEntry: 'focusEmailInput',
    },
  },
}

const passwordStates = {
  initial: 'noError',
  states: {
    noError: {},
    error: {
      initial: 'empty',
      states: {
        empty: {},
      },
      onEntry: 'focusPasswordInput',
    },
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
    message: undefined,
  },
  states: {
    authenticating: {
      id: 'checkAuth',
      invoke: {
        src: 'authenticate',
        onDone: {
          target: 'signedIn',
          actions: ['clearError', 'setAuth', 'setUser', 'setSuccess'],
        },
        onError: {
          target: 'signedOut',
          actions: ['clearAuth', 'clearUser', 'setApiError'],
        },
      },
    },
    // loading: {},
    // signingIn: {},
    // signingOut: {},
    signedIn: {
      on: {
        LOGOUT: {
          target: 'signedOut',
          actions: ['clearAuth', 'clearUser', 'clearError'],
        },
      },
    },
    signedOut: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            FORGOT_PASSWORD: {
              target: 'forgot',
              actions: 'clearPassword',
            },
            INPUT_EMAIL: [
              {
                cond: 'isValidEmail',
                actions: 'cacheEmail',
              },
            ],
            INPUT_PASSWORD: [
              {
                cond: 'isValidPassword',
                actions: 'cachePassword',
              },
            ],
            LOGIN: [
              {
                cond: 'isErrorEmailEmpty',
                actions: 'setErrorEmailEmpty',
                target: 'email.error',
              },
              {
                cond: 'isErrorEmailNotValid',
                actions: 'setErrorEmailNotValid',
                target: 'email.error.notValid',
              },
              {
                cond: 'isErrorPasswordEmpty',
                actions: 'setErrorPasswordEmpty',
                target: 'password.error',
              },
              {
                target: '#auth.authenticating',
              },
            ],
          },
          // after: {
          //   300000: {
          //     actions: 'clearUser',
          //   },
          // },
        },
        forgot: {
          on: {
            INPUT_EMAIL: {
              cond: 'isValidEmail',
              actions: 'cacheEmail',
            },
            RESET_PASSWORD: [
              {
                cond: 'isErrorEmailEmpty',
                actions: 'setErrorEmailEmpty',
                target: 'email.error',
              },
              {
                cond: 'isErrorEmailNotValid',
                actions: 'setErrorEmailNotValid',
                target: 'email.error.notValid',
              },
              {
                cond: 'isValidEmail',
                actions: ['clearError', 'clearUser'],
                target: 'reset',
              },
            ],
            CANCEL: {
              target: 'idle',
              actions: ['clearError', 'clearUser'],
            },
          },
        },
        reset: {
          id: 'resetPwd',
          invoke: {
            src: 'requestNewPassword',
            onDone: {
              actions: 'setSuccess',
              target: '#auth.signedOut',
            },
            onError: {
              actions: 'setApiError',
            },
          },
          on: {
            CANCEL: {
              target: 'forgot',
            },
          },
        },
        email: emailStates,
        password: passwordStates,
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
