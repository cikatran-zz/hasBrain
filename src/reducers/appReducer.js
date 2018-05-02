import {ScreenStack} from '../registerScreens'
const firstAction = ScreenStack.router.getActionForPathAndParams('Root');
const tempNavState = ScreenStack.router.getStateForAction(firstAction);

const initialNavState = ScreenStack.router.getStateForAction(
    tempNavState
);

export default function nav(state = initialNavState, action) {
    let nextState;
    nextState = ScreenStack.router.getStateForAction(action, state);

    return nextState || state;
}