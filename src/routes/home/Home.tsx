import * as React from 'react';
import { Button, Container, Divider, Header, Placeholder } from 'semantic-ui-react';
import {IGlobalContext, withGlobalContext} from '../../shared/contexts/global.context';

export interface IHomeProps {
    globalContext: IGlobalContext;
}

class Home extends React.Component<IHomeProps, {}> {

    constructor(props: IHomeProps) {
        super(props);
    }

    render() {
        const {globalContext} = this.props;

        return(
            <Container className='pt-5'>
                <Header as='h1' size='huge' className='pt-2'>
                    Welcome, { globalContext.userInfo ? globalContext.userInfo.name : 'User' }!
                </Header>
                <Divider className='pb-2'/>
                <Placeholder>
                    <Placeholder.Header image>
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                        <Placeholder.Line />
                    </Placeholder.Paragraph>
                </Placeholder>
                <Button as='a' className='mt-2'>
                    Read More
                </Button>
            </Container>
        );
    }

}

export default withGlobalContext(Home);
