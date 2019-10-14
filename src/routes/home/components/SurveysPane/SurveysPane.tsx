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
    filterQuery: string;
}

class SurveysPane extends React.Component<ISurveysPaneProps, ISurveysPaneState> {

    private allSurveys: Survey[] = [];

    constructor(props: ISurveysPaneProps) {
        super(props);

        this.state = {
            isLoading: false,
            filterQuery: ''
        };

        this.handleFilterQueryChange = this.handleFilterQueryChange.bind(this);
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
                    this.allSurveys = response.reverse();
                    this.setState({
                        isLoading: false,
                        surveys: this.allSurveys
                    });
                }).catch(error => {
                    this.setState({isLoading: false});
                    toast.error(error.toString());
                });
            }
        });
    }

    handleFilterQueryChange(value: string) {
        const filteredSurveys = this.allSurveys.filter(survey => {
            return (!value ||
                survey.title.toLowerCase().includes(value.toLowerCase()) ||
                survey.createdBy.toLowerCase().includes(value.toLowerCase()) ||
                survey.tags.join(' ').toLowerCase().includes(value.toLowerCase())
            );
        });
        this.setState({
            filterQuery: value,
            surveys: filteredSurveys
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
        const {isLoading, surveys, filterQuery} = this.state;

        return(
            <Grid>
                <Grid.Row>
                    <Grid.Column width={6}>
                        <Input fluid size='small' icon='search' placeholder='Search...' value={filterQuery}
                               onChange={(event) => this.handleFilterQueryChange(event.target.value)}/>
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
