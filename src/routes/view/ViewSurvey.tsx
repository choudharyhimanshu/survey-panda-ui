import * as React from 'react';
import {Container, Grid, Header, Icon} from 'semantic-ui-react';
import {IGlobalContext, withGlobalContext} from '../../shared/contexts/global.context';

export interface IViewProps {
    globalContext: IGlobalContext;
}

class ViewSurvey extends React.Component<IViewProps, {}> {

    constructor(props: IViewProps) {
        super(props);
    }

    render() {

        return(
            <Container className='pt-10'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column className='pt-10 pb-10' textAlign='center'>
                            <Header as='h2' icon>
                                <Icon name='settings' />
                                Under Construction!
                                <Header.Subheader>
                                    Request your patience. :)
                                </Header.Subheader>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }

}

export default withGlobalContext(ViewSurvey);
