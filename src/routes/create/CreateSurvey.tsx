import * as React from 'react';
import {Redirect} from 'react-router';
import {toast} from 'react-toastify';
import {Breadcrumb, Button, Container, Form, Grid, Icon, Label, List, Message} from 'semantic-ui-react';

import QuestionFormField from './components/QuestionFormField';
import {IQuestion, Survey} from '../../shared/models/Survey';
import surveyApiService from '../../shared/services/survey-api.service';
import {IGlobalContext, withGlobalContext} from '../../shared/contexts/global.context';

const DEFAULT_QUESTION: IQuestion = {
    id: '',
    options: [...[]],
    text: '',
    type: 'TEXT',
    required: true
};

const DEFAULT_SURVEY: Survey = {
    id: '',
    title: '',
    tags: [],
    createdOn: new Date(),
    createdBy: '',
    questions: [...[{...DEFAULT_QUESTION}]]
};

export interface ICreateSurveyProps {
    globalContext: IGlobalContext;
}

export interface ICreateSurveyState  {
    survey: Survey;
    tagToAdd: string;
    errorsInForm: string[];
    isPublishing: boolean;
    publishedSurveyId?: string;
}

class CreateSurvey extends React.Component<ICreateSurveyProps, ICreateSurveyState> {

    constructor(props: ICreateSurveyProps) {
        super(props);

        const userInfo = props.globalContext.userInfo;
        const survey = {...DEFAULT_SURVEY};
        survey.createdBy = userInfo ? userInfo.username : 'anonymous';

        this.state = {
            survey,
            tagToAdd: '',
            errorsInForm: [],
            isPublishing: false
        };

        this.handleTitleInput = this.handleTitleInput.bind(this);
        this.handleTagInput = this.handleTagInput.bind(this);
        this.handleTagAddition = this.handleTagAddition.bind(this);
        this.handleTagRemoval = this.handleTagRemoval.bind(this);
        this.handleQuestionTypeChange = this.handleQuestionTypeChange.bind(this);
        this.handleQuestionTextChange = this.handleQuestionTextChange.bind(this);
        this.handleQuestionOptionAddition = this.handleQuestionOptionAddition.bind(this);
        this.handleQuestionOptionRemoval = this.handleQuestionOptionRemoval.bind(this);
        this.handleQuestionAdditionAction = this.handleQuestionAdditionAction.bind(this);
        this.handleQuestionRemovalAction = this.handleQuestionRemovalAction.bind(this);
        this.handleSurveyPublishAction = this.handleSurveyPublishAction.bind(this);
    }

    handleTitleInput(value: string) {
        this.setState(prevState => {
           const survey = prevState.survey;
           survey.title = value;
           return {survey};
        });
    }

    handleTagInput(value: string) {
        this.setState({
           tagToAdd: value
        });
    }

    handleTagAddition(value: string) {
        if (value) {
            this.setState(prevState => {
                const survey = prevState.survey;
                survey.tags.push(value);
                return {
                    survey,
                    tagToAdd: ''
                };
            });
        }
    }

    handleTagRemoval(index: number) {
        this.setState(prevState => {
            const survey = prevState.survey;
            survey.tags.splice(index, 1);
            return {survey};
        });
    }

    handleQuestionTypeChange(questionIndex: number, value: string) {
        this.setState(prevState => {
            const survey = prevState.survey;
            survey.questions[questionIndex].type = value;
            return {survey};
        });
    }

    handleQuestionTextChange(questionIndex: number, value: string) {
        this.setState(prevState => {
            const survey = prevState.survey;
            survey.questions[questionIndex].text = value;
            return {survey};
        });
    }

    handleQuestionOptionAddition(questionIndex: number, value: string) {
        if (value) {
            this.setState(prevState => {
                const survey = prevState.survey;
                survey.questions[questionIndex].options.push(value);
                return {survey};
            });
        }
    }

    handleQuestionOptionRemoval(questionIndex: number, optionIndex: number) {
        this.setState(prevState => {
            const survey = prevState.survey;
            survey.questions[questionIndex].options.splice(optionIndex, 1);
            return {survey};
        });
    }

    handleQuestionAdditionAction() {
        this.setState(prevState => {
            const survey = prevState.survey;
            const newQuestion = {...DEFAULT_QUESTION};
            newQuestion.options = [...[]];
            survey.questions.push(newQuestion);
            return {survey};
        });
    }

    handleQuestionRemovalAction(index: number) {
        this.setState(prevState => {
            const survey = prevState.survey;
            if (survey.questions.length > 1) {
                survey.questions.splice(index, 1);
            }
            return {survey};
        });
    }

    handleSurveyPublishAction() {
        this.setState({
            isPublishing: true,
            errorsInForm: []
        }, () => {
            const {survey, errorsInForm}= this.state;

            if (!survey.title) {
                errorsInForm.push('A title is required for the survey');
            }

            if (survey.questions.find(question => !question.text)) {
                errorsInForm.push('A question is required to have some text');
            }

            if (survey.questions.find(question => (question.type !== 'TEXT' && question.options.length === 0))) {
                errorsInForm.push('At least one option is required for questions with type Select/Multi-Select');
            }

            if (errorsInForm.length > 0) {
                this.setState({
                    isPublishing: false,
                    errorsInForm
                });
            } else {
                surveyApiService.createSurvey(survey).then(response => {
                    this.setState({
                        isPublishing: false,
                        publishedSurveyId: response.id
                    });
                }).catch(error => {
                   toast.error(error.toString());
                   this.setState({isPublishing: false});
                });
            }
        });
    }

    render() {
        const {survey, tagToAdd, errorsInForm, isPublishing, publishedSurveyId} = this.state;

        return(
            <Container className='pt-10'>
                {publishedSurveyId && <Redirect to={'view/' + publishedSurveyId}/>}
                <Grid padded>
                    <Grid.Row>
                        <Grid.Column>
                            <Breadcrumb icon='right angle' sections={[
                                { key: 'Home', content: 'Home', link: true },
                                { key: 'Create', content: 'Create a survey', active: true },
                            ]} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <div>
                                <Form.Field className='pb-3'>
                                    <div className='ui big fluid input'>
                                        <input className='pl-0 no-border-top no-border-right no-border-left no-border-radius'
                                               placeholder='Give a title to your survey..' value={survey.title}
                                               onChange={(event) => this.handleTitleInput(event.target.value)}/>
                                    </div>
                                </Form.Field>
                                <Form.Field className='pb-3'>
                                    <label><h4 className='pb-1'>Tags</h4></label>
                                    <div className='pb-1'>
                                        {
                                            survey.tags.map((tag, index) =>
                                                <Label key={index} size='large' className='mb-1'>{tag} <Icon onClick={() => this.handleTagRemoval(index)} name='delete'/></Label>)
                                        }
                                    </div>
                                    <Form.Input width={6} size='mini' action={{ icon: 'add', onClick: () => this.handleTagAddition(tagToAdd) }} placeholder='Add a tag'
                                        value={tagToAdd} onChange={(event) => this.handleTagInput(event.target.value)} />
                                </Form.Field>
                                <Form.Group className='pb-3'>
                                    <label><h4 className='pb-2'>Questions</h4></label>
                                    {
                                        survey.questions.map((question, index) =>
                                            <QuestionFormField key={index} question={question}
                                                onTypeChange={(value) => this.handleQuestionTypeChange(index, value)}
                                                onTextChange={(value) => this.handleQuestionTextChange(index, value)}
                                                onOptionAddition={(value) => this.handleQuestionOptionAddition(index, value)}
                                                onOptionRemoval={(optionIndex) => this.handleQuestionOptionRemoval(index, optionIndex)}
                                                onDeleteAction={() => this.handleQuestionRemovalAction(index)}
                                            />
                                        )
                                    }
                                    <Button size='mini' fluid className='mt-1' onClick={this.handleQuestionAdditionAction}><Icon name='add'/></Button>
                                </Form.Group>
                            </div>
                            {
                                errorsInForm.length > 0 &&
                                    <Message warning>
                                        <Message.Header>There are some serious issues with the form!</Message.Header>
                                        <List bulleted>
                                            {errorsInForm.map((message, index) => <List.Item key={index}>{message}</List.Item>)}
                                        </List>
                                    </Message>
                            }
                            <Button fluid basic primary size='large' loading={isPublishing}
                                    onClick={this.handleSurveyPublishAction}>Publish <Icon name='send' className='ml-1'/></Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }

}

export default withGlobalContext(CreateSurvey);
