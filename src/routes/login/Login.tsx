import * as React from 'react';
import {ChangeEvent} from 'react';
import {Redirect} from 'react-router';
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
import {toast} from 'react-toastify';

import {IGlobalContext, withGlobalContext} from '../../shared/contexts/global.context';
import {UserInfo} from '../../shared/models/UserInfo';
import authService from '../../shared/services/auth.service';

export interface ILoginProps {
    onLogin: () => void;
    globalContext: IGlobalContext;
}

export interface ILoginState {
    isAuthenticating: boolean;
    isAuthenticated: boolean;
    userInfo: UserInfo;
}

class Login extends React.Component<ILoginProps, ILoginState> {

    constructor(props: ILoginProps) {
        super(props);

        this.state = {
            isAuthenticating: false,
            isAuthenticated: false,
            userInfo: {
                id: '',
                name: ''
            }
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleUserInfoInputChange = this.handleUserInfoInputChange.bind(this);
    }

    handleLogin(): void {
        this.setState({isAuthenticating: true}, () => {
            authService.setUserInfo(this.state.userInfo).then(response => {
                toast(response);
            }).catch(error => {
                toast.error(error.toString());
            });
            setTimeout(() => {
                this.setState({isAuthenticated: true}, () => this.props.onLogin());
            }, 1000);
        });
    }

    handleUserInfoInputChange(event: ChangeEvent<HTMLInputElement>): void {
        const {name, value} = event.target;
        this.setState(prevState => {
           const userInfo = prevState.userInfo;
           userInfo[name] = value;
           return {userInfo};
        });
    }

    componentDidMount() {
        if (this.props.globalContext.userInfo) {
            this.setState({
                isAuthenticated: true
            });
        }
    }

    render() {
        const {isAuthenticating, isAuthenticated, userInfo} = this.state;

        if (isAuthenticated) {
            return(
                <Redirect to='/' />
            );
        }

        return(
            <Grid textAlign='center' verticalAlign='middle' className='p-0 m-0'
                  style={{position: 'absolute', width: '100%', height: '100%'}}>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                        Log-in to your account
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input type='text' fluid icon='user' iconPosition='left' placeholder='Full name'
                                name='name' value={userInfo.name} onChange={this.handleUserInfoInputChange}/>
                            <Form.Input type='email' fluid icon='mail' iconPosition='left' placeholder='E-mail address'
                                name='id' value={userInfo.id} onChange={this.handleUserInfoInputChange}/>
                            <Form.Input type='password' fluid icon='lock' iconPosition='left' placeholder='Password' />

                            <Button color='teal' fluid size='large' disabled={isAuthenticating || !userInfo.id || !userInfo.name}
                                loading={isAuthenticating} onClick={this.handleLogin}>
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        New to us? <a>Sign Up</a>
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }

}

export default withGlobalContext(Login);
