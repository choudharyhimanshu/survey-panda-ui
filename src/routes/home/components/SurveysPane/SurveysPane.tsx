import * as React from 'react';
import {toast} from 'react-toastify';
import {Button, Grid, Header, Icon, Input, Loader} from 'semantic-ui-react';

import SurveyCard from '../SurveyCard/SurveyCard';
import {Survey} from '../../../../shared/models/Survey';
import surveyApiService from '../../../../shared/services/survey-api.service';
import {IGlobalContext, withGlobalContext} from '../../../../shared/contexts/global.context';

export interface ISurveysPaneProps {
    getMySurveys: boolean;
    globalContext: IGlobalContext;
}

export interface ISurveysPaneState {
    surveys?: Survey[];
    isLoading: boolean;
}

class SurveysPane extends React.Component<ISurveysPaneProps, ISurveysPaneState> {

    constructor(props: ISurveysPaneProps) {
        super(props);

        this.state = {
            isLoading: false
        };
    }

    fetchSurveys() {
        this.setState({isLoading: true}, () => {
            const username = this.props.globalContext.userInfo ? this.props.globalContext.userInfo.username : '';

            if (this.props.getMySurveys && !username) {
                toast.error('User session not found.');
                this.setState({isLoading: false});
            } else {
                const request = this.props.getMySurveys ? surveyApiService.getAllSurveys(username) : surveyApiService.getAllSurveys();
                request.then(response => {
                    this.setState({
                        isLoading: false,
                        surveys: response
                    });
                }).catch(error => {
                    this.setState({isLoading: false});
                    toast.error(error.toString());
                });
            }
        });
    }

    componentDidMount() {
        this.fetchSurveys();
    }

    componentWillReceiveProps(newProps: ISurveysPaneProps) {
        if (newProps.getMySurveys !== this.props.getMySurveys) {
            this.fetchSurveys();
        }
    }

    render() {
        const {isLoading, surveys} = this.state;

        return(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Input fluid size='small' icon='search' placeholder='Search...' />
                    </Grid.Column>
                    <Grid.Column width={10} textAlign='right'>
                        <Button primary size='small' href='#/create'><Icon className='mr-1' name='add'/>Create New</Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    {   isLoading
                        ?   <Grid.Column><Loader active inline='centered' className='mt-5 mb-5' /></Grid.Column>
                        :   surveys
                            ?   surveys.length > 0
                                ?   surveys.map(survey =>
                                        <Grid.Column key={survey.id} mobile={16} tablet={8} computer={4} largeScreen={4} className='pb-3'>
                                            <SurveyCard survey={survey}/>
                                        </Grid.Column>
                                    )
                                :   <Grid.Column>
                                        <Header as='h4' className='pt-3 pb-3' textAlign='center'>
                                            <Header.Content><Icon name='warning' /> No results found.</Header.Content>
                                        </Header>
                                    </Grid.Column>
                            :   <Grid.Column>
                                    <Header as='h4' className='pt-3 pb-3' textAlign='center'>
                                        <Header.Content><Icon name='warning' /> Error occurred while fetching the surveys.</Header.Content>
                                    </Header>
                                </Grid.Column>
                    }
                </Grid.Row>
            </Grid>
        );
    }
}

export default withGlobalContext(SurveysPane);
