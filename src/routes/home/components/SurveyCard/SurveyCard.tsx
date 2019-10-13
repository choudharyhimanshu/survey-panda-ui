import * as React from 'react';
import Moment from 'moment';
import {Card, Icon, Label} from 'semantic-ui-react';

import {Survey} from '../../../../shared/models/Survey';

export interface ISurveyCardProps {
    survey: Survey;
}

class SurveyCard extends React.Component<ISurveyCardProps> {

    constructor(props: ISurveyCardProps) {
        super(props);

    }

    render() {
        const {survey} = this.props;

        return(
            <Card link href={'#/view/' + survey.id}>
                <Card.Content>
                    <Card.Header className='pb-1'>{survey.title}</Card.Header>
                    <Card.Meta>
                        <span className='date'>
                            Created on {Moment(survey.createdOn).format('DD MMM YYYY')} by <strong>{survey.createdBy}</strong>
                        </span>
                    </Card.Meta>
                    <Card.Description className='pt-1 pb-1'>
                        {
                            survey.tags.map(tag =>
                                <Label key={tag}>{tag}</Label>
                            )
                        }
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <div>
                        <Icon name='list ol' />
                        {survey.questions.length} Question{survey.questions.length > 1 && 's'}
                    </div>
                </Card.Content>
            </Card>
        );
    }
}

export default SurveyCard;
