import pkg from 'validator'
import {assign} from 'xstate'
import {authenticate, requestPassword} from './authService'

const {isEmail} = pkg

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
    return eventType && context.email.length > 0 && !isEmail(context.email)
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
    email: event.email,
  })),
  cachePassword: assign((context, event) => ({
    password: event.password,
  })),
  onLoginFailed: assign(() => ({
    email: '',
    password: '',
  })),
  onSuccess: assign(() => {
    alert('🎉 Signed in')
  }),
  isPasswordRecoveryEmailSent: assign(() => {
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
  requestSignIn: async (context, event) => {
    console.log('requestSignIn - context.email, context.password')
    console.log(context.email, context.password)
    return await authenticate(context.email, context.password)
  },
  // requestNewPassword: (context, event) => requestPassword(context.email),
  requestNewPassword: async (context, event) => {
    console.log('event')
    console.log(event)

    const passWordReset = await requestPassword(context.email)
    console.log('passWordReset')
    console.log(passWordReset)
    return passWordReset
  },
}

function initMachineOptions({
  handleEmailInputFocus,
  handlePasswordInputFocus,
  handleSubmitButtonFocus,
}) {
  const machineOptions = {
    actions: {
      focusEmailInput: handleEmailInputFocus,
      focusPasswordInput: handlePasswordInputFocus,
      focusSubmitButton: handleSubmitButtonFocus,
      ...formActions,
    },
    guards: {
      ...guardFunctions,
    },
    services: {
      ...serviceFunctions,
    },
  }

  return {...machineOptions}
}

export default initMachineOptions
