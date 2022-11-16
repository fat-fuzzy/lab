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
				empty: {
					on: {
						INPUT_EMAIL: [
							{
								target: '#auth.signedOut',
								cond: 'isValidEmail',
								actions: ['clearError', 'cacheEmail'],
							},
						],
					},
				},
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
				empty: {
					on: {
						INPUT_PASSWORD: [
							{
								target: '#auth.signedOut',
								cond: 'isValidPassword',
								actions: ['clearError', 'cachePassword'],
							},
						],
					},
				},
			},
			onEntry: 'focusPasswordInput',
		},
	},
}

// create a state machine config
const config = {
	context: {auth: undefined, user: undefined, error: undefined, message: undefined},
	id: 'auth',
	initial: 'authenticating',
	states: {
		authenticating: {
			invoke: {
				src: 'authenticate',
				onDone: [
					{
						target: 'signedIn',
						actions: ['clearError', 'setAuth', 'setUser', 'setSuccess'],
					},
				],
				onError: [
					{
						target: 'signedOut',
						actions: ['clearAuth', 'clearUser', 'setApiError'],
					},
				],
			},
		},
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
					initial: 'email',
					states: {
						email: {
							initial: 'noError',
							states: {
								noError: {},
								error: {
									entry: 'focusEmailInput',
									initial: 'empty',
									states: {
										empty: {
											on: {
												INPUT_EMAIL: {
													target: '#auth.signedOut',
													cond: 'isValidEmail',
													actions: ['clearError', 'cacheEmail'],
												},
											},
										},
										notValid: {},
									},
								},
							},
						},
						password: {
							initial: 'noError',
							states: {
								noError: {},
								error: {
									entry: 'focusPasswordInput',
									initial: 'empty',
									states: {
										empty: {
											on: {
												INPUT_PASSWORD: {
													target: '#auth.signedOut',
													cond: 'isValidPassword',
													actions: ['clearError', 'cachePassword'],
												},
											},
										},
									},
								},
							},
						},
					},
					on: {
						FORGOT_PASSWORD: {
							target: 'forgot',
							actions: 'clearPassword',
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
								target: '.email.error',
								cond: 'isErrorEmailEmpty',
								actions: 'setErrorEmailEmpty',
							},
							{
								target: '.email.error.notValid',
								cond: 'isErrorEmailNotValid',
								actions: 'setErrorEmailNotValid',
							},
							{
								target: '.password.error',
								cond: 'isErrorPasswordEmpty',
								actions: 'setErrorPasswordEmpty',
							},
							{
								target: '#auth.authenticating',
							},
						],
					},
				},
				forgot: {
					initial: 'email',
					states: {
						email: {
							initial: 'noError',
							states: {
								noError: {},
								error: {
									entry: 'focusEmailInput',
									initial: 'empty',
									states: {
										empty: {
											on: {
												INPUT_EMAIL: {
													target: '#auth.signedOut',
													cond: 'isValidEmail',
													actions: ['clearError', 'cacheEmail'],
												},
											},
										},
										notValid: {},
									},
								},
							},
						},
						password: {
							initial: 'noError',
							states: {
								noError: {},
								error: {
									entry: 'focusPasswordInput',
									initial: 'empty',
									states: {
										empty: {
											on: {
												INPUT_PASSWORD: {
													target: '#auth.signedOut',
													cond: 'isValidPassword',
													actions: ['clearError', 'cachePassword'],
												},
											},
										},
									},
								},
							},
						},
					},
					on: {
						INPUT_EMAIL: {
							cond: 'isValidEmail',
							actions: 'cacheEmail',
						},
						RESET_PASSWORD: [
							{
								target: '.email.error',
								cond: 'isErrorEmailEmpty',
								actions: 'setErrorEmailEmpty',
							},
							{
								target: '.email.error.notValid',
								cond: 'isErrorEmailNotValid',
								actions: 'setErrorEmailNotValid',
							},
							{
								target: 'reset',
								cond: 'isValidEmail',
								actions: ['clearError', 'clearUser'],
							},
						],
						CANCEL: {
							target: 'idle',
							actions: ['clearError', 'clearUser'],
						},
					},
				},
				reset: {
					invoke: {
						src: 'requestNewPassword',
						onDone: [
							{
								target: '#auth.signedOut',
								actions: 'setSuccess',
							},
						],
						onError: [
							{
								actions: 'setApiError',
							},
						],
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
const authMachine =
	/** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOjVsAdugJYDGyJBUAxBAPYFjbEEBudA1k3jj4SeUpQELdoOIMA2gAYAujNmJQABzqxiJBkpAAPRACYAbABZsxgMzGAHAE5pAdmP2H08wBoQAT0QBGewFZTBx87fx9zQx9pK2MAX1iPHlwMTH4yChYaMAAnbLps7GUAGwoAM3yAW2SsatSidKERNjpxKTkFbVV1TQJtPQQjUwtrO0dnZ3cvX38bf2xzcxsbKP8HfWl9H3jElOx1KEYIAEkCagAZAHkAcQuAVQAVDqQQLo0JXuf+-xjsfSt9GyGIHheyGWYebwIPyGezYGzGJaWaTSfz2cxo7YgJL7Q4XDDMCBFJhgCrIYhFbA5PIFEnKdCeahHAByAAUHgB9ACiAFkAIJHM5PFRqN5aT6+YxAuHRf5WNH+cxhQwQgw+OY2AH6AJhIyzcyY7HEA6QPHoAlEwrIWCwADu+QglNy+UpFTpDOZbPu7JZvIAyr6AOoXABKABEhS8RT0+hKpXYrLL5YqfMqpghLPp5jZzPoEWE-D45f4DbscSb8cRCWBqAAxEM3L0+-1BsMR17R8VQyWGaUJv5JpUqqHmHymez2JYT5zfFYlmpliCm83Vj0cnn8wVyTpR94xhA2Kw+bD+GYWAFWBYH4xDpxWbCGdHhQaShX6hJY0tG3EVquM1kcptAxDcMt2edtd07WYj3HYxdSiYxkUWId0RsOFNUWLVzGCN8dnnL9yzNSsiXOa5mTbHcxVAfoL0zQx1gfGYrAfP4fCHZZzGwHwuNWRw1XHNU5xwBclyI6tLiuMifEUMCKI+KjEBo+96MVA9mMPIdDyGVxIgQ4xjELWZBL2fDFx-YjxLI-RpOFboIPkhBFLo6QGNUnN1LTHw-h7ewi1BGFAgE99DWNUzCN-CymUkcxrMjWzKN0RAcxCMw-GsaRJSLDTMwPLDsyMAsiyM4T8XKbIoDoM0STJCkqWdWl6T-T0uT5AVyLiuSEoGBVTELBUNjRCwAiHEEOPMJjHECfw-isaQbCKkyl1K8qzWUK1bXtR1qRdN1GoAv0gNbUCbNFDr+n0brOKsPrMMG-xhsQswZocb4IkLFN5pCxb8mW3avXXVqjtik693WLD5hzfQAR086fKHOij0MZyfJhLVQhwj88M+krvoq6hg05X1OUbfaWxAmLwPi-pC1g7AExsbVczsfRLGG2D1TlOUsPHDDDA+78zSW3H8cJ4nm2AyQpO3dq92pzM6YZhENhZjyc1hVH6fplFDxRPmCOwQX0Dxgmie9EnxasqXgc7c7LEu66BvRO60yuntPMiAE1VcOxeaCz8sYFnHDYAYV5Jkg85TdydkkGxukWmnAfBZIkPExhvh7BZsYxUUUZ3XQuwbI4DAQ36EYZhmi4WpjP9gui-QJoxAyNp5EBinTsS0dM2ME8YSS8cBo0+xM1WfSwUlfSuPR4L+dr2Bi+oWqCmKMpKir4qzULuf69EFom4IBQ2qt+zptovxFW6oEpyHUE7xRlTuxPLU86XTf55DsOI8Pjtj4CHt9IvVEMRlibCHKsI8nkpoRHzMzdK9h4jvgIHQCAcBtBJD4PUcQVBLbf06rBYa45MyWBHHRBUQJNh5xONguyuDDB3iiLmFMSxNiZQ8oeVC-h-KBCcGNccz8zLElJOSbAiDOROmyFQymvhmHYACJ5bMhZmZojYgmX4lhQQHk2CmOBvtMYz1Ei6aqm06qunpBI9uUJma0WBMsKIURHD6A0geX4CJATokRm4vhYULRVSEYvYRFUABqyAiiVjMTLaR+kNQjz7IeBxzsxq-EMGEVEYJZhXU8cuAxvixFhM7FxZwKUonpRiZ5a+0gjwjkngmLCY0wQZP0T4oouT7JcUhoU86xTZSlLTO7eYfxZr2DVLQ1YPtcJCQWvwy01o7TZAdCInJMlpZ5OkbIgEI5-jokmJCLiCJfgbFof8AsD56lVimetWZRiaQmMhMdHBVNIYcXSlqdYE5JT92Gm5Ti+lIGvXoici0q1pkbUXs0zq+S5hPKHg4eEMJxzDRCOAos6UETrGiP8pggLzkQFBVTTysJIUvJhe8jyzk46bEBC+CwdFaHopxYgHypgnIuSYm5ViaZIHzG7q4f4dhJTZgyQbLJFJ5nUjpQMLCPZ+qgkGYeRYSThpgM4lxcIgR-g+SsAKwOQrLnbVMYso+nVmbJXhEYJJURkT03sKzLinEjA5hNSEemmqyoVW1X4xB6AgkhOxfqu5BgsJzDBKiXM1g0SwI+WEL5apma-Ocs65abqFm3OoWdGG95ZhDz0pzcNHlNg9SRXpDUyINU6PGTXQVjSxWQ1mum4NWaw1OHhedPZek6KHhiIM7RYzq4z0FZimZcy6CiNFb6lN-rCycR1OiUNE4tkKTor8Ga-xuwQIRPG11-bgViN1TcoGfrxXGtgkCMIyIBlWpJfpX4IQkkHhzhrddK01oDsuVWrUR4TXHvNWeti6VEkcIQtmRGSwS3dvXvrLVm7ZmvuZnCI9ZrT2WuvmiX4lqeVyhlaMjGZbe2BzFX4eEtNbAKyZsrSEtDTAjicK4EYGpFQZNfugKtCY46HI4eiF5rhB6EJmudP4Y1wjWE8WKtEPYmUqRZSxYaRhYORACGNSwTELCCTFQAWlTJCFT6olganHDNBC6JZrwNiEAA */
	createMachine(config, machineOptions)

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
