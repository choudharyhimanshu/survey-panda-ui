import * as React from 'react';
import {Container, Grid, Tab} from 'semantic-ui-react';
import {IGlobalContext, withGlobalContext} from '../../shared/contexts/global.context';
import SurveysPane from './components/SurveysPane/SurveysPane';

export interface IHomeProps {
    globalContext: IGlobalContext;
}

const panes = [
    {
        menuItem: 'All Surveys',
        render: () => <SurveysPane getMySurveys={false}/>
    },
    {
        menuItem: 'My Surveys',
        render: () => <SurveysPane getMySurveys={true}/>
    }
];

class Home extends React.Component<IHomeProps, {}> {

    constructor(props: IHomeProps) {
        super(props);
    }

    render() {
        const {globalContext} = this.props;

        return(
            <Container className='pt-10'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }

}

export default withGlobalContext(Home);
