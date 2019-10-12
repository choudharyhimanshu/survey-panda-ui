import * as React from 'react';
import {Redirect, Route, RouteProps} from 'react-router';

import {IGlobalContext, withGlobalContext} from '../contexts/global.context';

export interface IProtectedRouteProps extends RouteProps {
    component: any;
    globalContext: IGlobalContext;
}

class ProtectedRoute extends React.Component<IProtectedRouteProps> {

    constructor(props: IProtectedRouteProps) {
        super(props);
    }

    render() {
        const {globalContext} = this.props;

        return(
            globalContext.userInfo ? <Route component={this.props.component} /> : <Redirect to='/login'/>
        );
    }
}

export default withGlobalContext(ProtectedRoute);
