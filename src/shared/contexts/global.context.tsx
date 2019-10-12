import * as React from 'react';
import {UserInfo} from '../models/UserInfo';

export interface IGlobalContext {
    userInfo?: UserInfo;
}

export const GlobalContext = React.createContext<IGlobalContext>({});

export function withGlobalContext(WrappedComponent: any) {
    return function WrapperComponent(props: any) {
        return(
            <GlobalContext.Consumer>
                { context => <WrappedComponent {...props} globalContext={context} /> }
            </GlobalContext.Consumer>
        );
    }
}
