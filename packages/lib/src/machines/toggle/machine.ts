import {createMachine} from 'xstate'
const machineConfig = {
	predictableActionArguments: true,
	// todo : fix type
	id: 'toggle',
	initial: 'inactive',
	states: {
		inactive: {
			on: {TOGGLE: 'active'},
		},
		active: {
			on: {TOGGLE: 'inactive'},
		},
	},
}
const machine: any = createMachine(machineConfig)
export default machine
