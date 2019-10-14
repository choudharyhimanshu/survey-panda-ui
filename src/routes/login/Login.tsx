import * as React from 'react';
import {ChangeEvent} from 'react';
import {Redirect} from 'react-router';
import {Button, Form, Grid, Header, Icon, Message, Segment} from 'semantic-ui-react';
import {toast} from 'react-toastify';

import {IGlobalContext, withGlobalContext} from '../../shared/contexts/global.context';
import {UserInfo} from '../../shared/models/UserInfo';
import authService from '../../shared/services/auth.service';
import surveyApiService from '../../shared/services/survey-api.service';

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
                username: ''
            }
        };

        this.handleLogin = this.handleLogin.bind(this);
        this.handleUserInfoInputChange = this.handleUserInfoInputChange.bind(this);
    }

    private healthcheckApi() {
        surveyApiService.checkHealth().catch(error => {
            toast.error('API server is not responding.');
        });
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
        this.healthcheckApi();
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
                        Let's start with a fancy username
                    </Header>
                    <Form size='large'>
                        <Segment stacked>
                            <Form.Input type='text' fluid icon='user' iconPosition='left' placeholder='Username'
                                name='username' value={userInfo.username} onChange={this.handleUserInfoInputChange}/>

                            <Button color='teal' fluid size='large' disabled={isAuthenticating || !userInfo.username}
                                loading={isAuthenticating} onClick={this.handleLogin}>
                                Continue <Icon name='arrow right'/>
                            </Button>
                        </Segment>
                    </Form>
                </Grid.Column>
            </Grid>
        );
    }

}

export default withGlobalContext(Login);
