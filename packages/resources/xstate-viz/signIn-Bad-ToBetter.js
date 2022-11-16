import { createMachine, assign } from "xstate";

const mockApi = {
  isNoResponse: () => Math.random() >= 0.75,
  isNoResponseFake: () => true,
  isLoginFailed: (email, password) =>
    email !== "admin@admin.com" || password !== "admin",
  isPasswordRecovery: (email) => ({ email }),
  isSignInSuccess: (email) => ({ email }),
};

export const requestPassword = (email) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockApi.isNoResponseFake()) {
        reject({ code: 3 });
      }

      if (mockApi.isPasswordRecovery(email)) {
        resolve({ code: 0, payload: { email } });
      }

      resolve(null);
    }, 1500);
  });

export const authenticate = (email, password) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockApi.isLoginFailed(email, password)) {
        reject({ code: 2 });
      }

      if (mockApi.isNoResponse()) {
        reject({ code: 3 });
      }

      if (mockApi.isSignInSuccess(email)) {
        resolve({ code: 0, payload: { email } });
      }

      // if (isInternalServerErr()) {
      // 	reject({code: 4})
      // }

      resolve(null);
    }, 1500);
  });

/**
 * Type definitions
 */
export const Events = {
  SUBMIT: "SUBMIT",
  CANCEL: "CANCEL",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  RESET_PASSWORD: "RESET_PASSWORD",
  INPUT_EMAIL: "INPUT_EMAIL",
  INPUT_PASSWORD: "INPUT_PASSWORD",
  LOGOUT: "LOGOUT",
};

/**
 * Guard Functions
 * - Test that a condition is true or false in a given context and / or for a given event
 * - Are used to effect a transition *if condition = true*
 */

const guardFunctions = {
  isNoEmail: (context, event) => {
    return context.email.length === 0;
  },
  isEmailMinLength: (context, event) => {
    return context.email.length > 5; // fake test
  },
  isPasswordMinLength: (context, event) => {
    return context.password.length > 0; // fake test
  },
  isEmailBadFormat: (context, event) => {
    return context.email.length > 0 && !isEmail(context.email);
  },
  isNoPassword: (context, event) => context.password.length === 0,
  isPasswordShort: (context, event) => context.password.length < 5,
  isSignInEmailSent: (context, event) => event.data.code === 0,
  isPasswordRecoveryEmailSent: (context, event) => event.data.code === 1,
  isLoginFailed: (context, event) => event.data.code === 2,
  isNoResponse: (context, event) => event.data.code === 3,
  isInternalServerErr: (context, event) => event.data.code === 4,
};

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
    email: "",
    password: "",
  })),
  onSuccess: assign(() => {
    alert("🎉 Signed in");
  }),
  isPasswordRecoveryEmailSent: assign(() => {
    alert(
      "💌  If that email address is in our database, we will send you an email to reset your password."
    );
    return {
      email: "",
      password: "",
    };
  }),
};

/**
 * Mock form actions produce a side-effect on the ui
 * TODO : replace by actual component handler functions
 */
const mockUiActions = {
  handleEmailInputFocus: assign(() => console.log("Focus on email input")),
  handlePasswordInputFocus: assign(() =>
    console.log("Focus on password input")
  ),
  handleSubmitButtonFocus: assign(() => console.log("Focus on submit button ")),
};

/**
 * Service invocation functions
 * - call function in a child machine
 * - setup the invoking function (the parent machine) to wait for the resolution of the call in the child
 */
const serviceFunctions: any = {
  requestSignIn: async (context, event) => {
    console.log("requestSignIn - context.email, context.password");
    console.log(context.email, context.password);
    return await authenticate(context.email, context.password);
  },
  // requestNewPassword: (context, event) => requestPassword(context.email),
  requestNewPassword: async (context, event) => {
    console.log("event");
    console.log(event);

    const passWordReset = await requestPassword(context.email);
    console.log("passWordReset");
    console.log(passWordReset);
    return passWordReset;
  },
};

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
};

interface Context {
  email: "";
  password: "";
}
const emailStates = {
  initial: "noError",
  states: {
    noError: {},
    error: {
      initial: "empty",
      states: {
        empty: {},
        badFormat: {},
      },
      onEntry: "focusEmailInput",
    },
  },
};

const passwordStates = {
  initial: "noError",
  states: {
    noError: {},
    error: {
      initial: "empty",
      states: {
        empty: {},
        tooShort: {},
      },
      onEntry: "focusPasswordInput",
    },
  },
};

const authServiceStates = {
  initial: "noError",
  states: {
    noError: {},
    error: {
      initial: "communication",
      states: {
        communication: {
          on: {
            SUBMIT: "#signInForm.loading",
          },
        },
        login: {
          on: {
            SUBMIT: {
              target: "#signInForm.loggedOut",
              // actions: 'onLoginFailed',
            },
            FORGOT_PASSWORD: "#signInForm.forgotPassword",
          },
        },
        forgot: {
          on: {
            RESET_PASSWORD: "#signInForm.resetPassword",
          },
        },
        reset: {
          on: {
            RESET_PASSWORD: "#signInForm.resetPassword",
          },
        },
        internal: {},
      },
    },
  },
};
const fetchMachine = createMachine(
  {
    id: "signInForm",
    initial: "loggedOut",
    context: {
      email: "",
      password: "",
    },
    states: {
      loggedOut: {
        type: "parallel" as const,
        on: {
          INPUT_EMAIL: {
            actions: "cacheEmail",
            target: "loggedOut.email.noError",
          },
          INPUT_PASSWORD: {
            actions: "cachePassword",
            target: "loggedOut.password.noError",
          },
          SUBMIT: [
            {
              cond: "isNoEmail",
              target: "loggedOut.email.error.empty",
            },
            {
              cond: "isEmailBadFormat",
              target: "loggedOut.email.error.badFormat",
            },
            {
              cond: "isNoPassword",
              target: "loggedOut.password.error.empty",
            },
            {
              cond: "isPasswordShort",
              target: "loggedOut.password.error.tooShort",
            },
            {
              target: "loading",
            },
          ],
          FORGOT_PASSWORD: [
            {
              target: "forgotPassword",
            },
          ],
          CANCEL: [
            {
              target: "loggedOut",
            },
          ],
        },
        states: {
          email: { ...emailStates },
          password: { ...passwordStates },
          authService: { ...authServiceStates },
        },
      },
      loading: {
        on: {
          CANCEL: "loggedOut",
        },
        invoke: {
          src: "requestSignIn",
          onDone: {
            actions: "onSuccess",
            target: "loggedIn",
          },
          onError: [
            {
              cond: "isLoginFailed",
              target: "loggedOut.authService.error.login",
            },
            {
              cond: "isNoResponse",
              target: "loggedOut.authService.error.communication",
            },
            {
              cond: "isInternalServerErr",
              target: "loggedOut.authService.error.internal",
            },
          ],
        },
      },
      forgotPassword: {
        initial: "noError",
        on: {
          INPUT_EMAIL: {
            actions: "cacheEmail",
            target: "forgotPassword.email.noError",
          },
          RESET_PASSWORD: [
            {
              cond: "isNoEmail",
              target: "forgotPassword.email.error.empty",
            },
            {
              cond: "isEmailBadFormat",
              target: "forgotPassword.email.error.badFormat",
            },
            {
              target: "resetPassword",
            },
          ],
          CANCEL: [
            {
              target: "loggedOut",
            },
          ],
        },
        states: {
          noError: {},
          error: {
            initial: "empty",
            states: {
              empty: {},
            },
            onEntry: "focusEmailInput",
          },
          email: { ...emailStates },
          authService: { ...authServiceStates },
        },
      },
      resetPassword: {
        initial: "noError",
        on: {
          INPUT_EMAIL: {
            actions: "cacheEmail",
            target: "resetPassword.email.noError",
          },
          CANCEL: "loggedOut",
        },
        invoke: {
          src: "requestNewPassword",
          onDone: {
            actions: "isPasswordRecoveryMaybe",
            target: "loggedOut",
          },
          onError: [
            {
              cond: "isNoResponse",
              target: "resetPassword.authService.error.communication",
            },
          ],
        },
        states: {
          noError: {},
          error: {
            initial: "empty",
            states: {
              empty: {},
            },
            onEntry: "focusEmailInput",
          },
          email: { ...emailStates },
          authService: { ...authServiceStates },
        },
      },
      loggedIn: {
        on: {
          LOGOUT: "loggedOut",
        },
      },
    },
  },
  machineOptions
);
