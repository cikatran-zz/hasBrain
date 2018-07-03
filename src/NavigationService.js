import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params,
        })
    );
}

function reset(routeName) {
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: routeName })],
        key: null
    });

    _navigator.dispatch(resetAction)
}

function navigateToTop() {
    _navigator.dispatch(
        StackActions.popToTop()
    )
}

// add other navigation functions that you need and export them

export default {
    navigate,
    navigateToTop,
    reset,
    setTopLevelNavigator,
};