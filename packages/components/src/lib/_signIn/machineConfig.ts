const emailStates = {
  initial: 'noError',
  states: {
    noError: {},
    error: {
      initial: 'empty',
      states: {
        empty: {},
        badFormat: {},
      },
      onEntry: 'focusEmailInput',
      on: {
        INPUT_EMAIL: {
          cond: 'isEmailMinLength',
          actions: 'cacheEmail',
          target: 'noError',
        },
      },
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
        tooShort: {},
      },
      onEntry: 'focusPasswordInput',
      on: {
        INPUT_PASSWORD: {
          cond: 'isPasswordMinLength',
          actions: 'cachePassword',
          target: 'noError',
        },
      },
    },
  },
}

const authServiceStates = {
  initial: 'noError',
  states: {
    noError: {},
    error: {
      initial: 'communication',
      states: {
        communication: {
          on: {
            SUBMIT: '#signInForm.loading',
          },
        },
        login: {
          on: {
            SUBMIT: '#signInForm.loading',
            FORGOT_PASSWORD: 'forgot',
          },
        },
        forgot: {
          on: {
            RESET_PASSWORD: [
              {
                target: 'reset',
              },
            ],
            CANCEL: [
              {
                target: '#signInForm.loggedOut',
              },
            ],
          },
        },
        reset: {
          on: {
            SUBMIT: '#signInForm.loading',
          },
        },
        internal: {},
      },
    },
  },
}

const machineConfig = {
  id: 'signInForm',
  initial: 'loggedOut',
  context: {
    email: '',
    password: '',
  },
  states: {
    loggedOut: {
      on: {
        INPUT_EMAIL: {
          actions: 'cacheEmail',
        },
        INPUT_PASSWORD: {
          actions: 'cachePassword',
        },
        SUBMIT: [
          {
            cond: 'isNoEmail',
            target: 'email.error.empty',
          },
          {
            cond: 'isEmailBadFormat',
            target: 'email.error.badFormat',
          },
          {
            cond: 'isNoPassword',
            target: 'password.error.empty',
          },
          {
            cond: 'isPasswordShort',
            target: 'password.error.tooShort',
          },
          {
            target: 'loading',
          },
        ],
        FORGOT_PASSWORD: 'authService.error.forgot',
        CANCEL: {},
      },
    },
    loading: {
      on: {
        CANCEL: 'loggedOut',
      },
      invoke: {
        src: 'requestSignIn',
        onDone: {
          actions: 'onSuccess',
          target: 'loggedIn',
        },
        onError: [
          {
            cond: 'isLoginFailed',
            target: 'authService.error.login',
          },
          {
            cond: 'isNoResponse',
            target: 'authService.error.communication',
          },
          // {
          //   cond: 'isInternalServerErr',
          //   target: 'loggedOut.authService.error.internal',
          // },
        ],
      },
    },
    resetPassword: {
      on: {
        CANCEL: 'loggedOut',
      },
      invoke: {
        src: 'requestNewPassword',
        onDone: {
          actions: 'isPasswordRecoveryEmailSent',
          target: 'loggedOut',
        },
        onError: [
          {
            cond: 'isNoResponse',
            target: 'authService.error.communication',
          },
        ],
      },
    },
    loggedIn: {
      on: {
        LOGOUT: 'loggedOut',
      },
    },
    email: {...emailStates},
    password: {...passwordStates},
    authService: {...authServiceStates},
  },
}
export default machineConfig
