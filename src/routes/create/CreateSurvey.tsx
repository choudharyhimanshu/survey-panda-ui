import * as React from 'react';
import {Container, Grid} from 'semantic-ui-react';
import {IGlobalContext, withGlobalContext} from '../../shared/contexts/global.context';

export interface IViewProps {
    globalContext: IGlobalContext;
}

class CreateSurvey extends React.Component<IViewProps, {}> {

    constructor(props: IViewProps) {
        super(props);
    }

    render() {

        return(
            <Container className='pt-10'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <h2>Create a Survey</h2>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }

}

export default withGlobalContext(CreateSurvey);
