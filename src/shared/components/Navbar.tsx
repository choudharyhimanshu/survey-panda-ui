import * as React from 'react';
import { Link } from 'react-router-dom';
import { Container, Icon, Menu } from 'semantic-ui-react';
import {toast} from 'react-toastify';

import {IGlobalContext, withGlobalContext} from '../contexts/global.context';
import authService from '../services/auth.service';

import logo from '../../logo.svg';

export interface INavbarProps {
    onLogout: () => void;
    globalContext: IGlobalContext;
}

class Navbar extends React.Component<INavbarProps, {}> {

    constructor(props: INavbarProps) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(): void {
        authService.clearUserInfo().then(response => {
            this.props.onLogout();
            toast(response);
        }).catch(error => {
            toast.error(error.toString());
        });
    }

    render() {
        const {globalContext} = this.props;

        return (
            <Menu fixed='top'>
                <Container fluid>
                    <Menu.Item className='item'><img src={logo}/><strong>FOOBAR</strong></Menu.Item>
                    { globalContext.userInfo && <Link className='item' to='/'>Home</Link> }
                    { globalContext.userInfo && <Link className='item' to='/example'>Example</Link> }
                    { globalContext.userInfo &&
                        <Menu.Item position='right'>
                            <Icon name='user secret' className='mr-1'/> {globalContext.userInfo.name}
                            <Icon name='sign-out' className='ml-2'/><a className='pointer-cursor' onClick={this.handleLogout}>Logout</a>
                        </Menu.Item>
                    }
                </Container>
            </Menu>
        );
    }

}

export default withGlobalContext(Navbar);
