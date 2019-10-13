import * as React from 'react';
import {Button, Dropdown, Form, Icon, Input, Label, List} from 'semantic-ui-react';
import {IQuestion} from '../../../shared/models/Survey';

const QUESTION_TYPES = [
    { key: 'text', text: 'Text', value: 'TEXT' },
    { key: 'select', text: 'Select', value: 'SELECT' },
    { key: 'multi-select', text: 'Multi Select', value: 'MULTI_SELECT' },
];

export interface IQuestionFormFieldProps {
    question: IQuestion;
    onTextChange: (value: string) => void;
    onTypeChange: (value: string) => void;
    onOptionAddition: (value: string) => void;
    onOptionRemoval: (index: number) => void;
    onDeleteAction: () => void;
}

export interface IQuestionFormFieldState {
    optionToAdd: string;
}

class QuestionFormField extends React.Component<IQuestionFormFieldProps, IQuestionFormFieldState> {

    constructor(props: IQuestionFormFieldProps) {
        super(props);

        this.state = {
            optionToAdd: ''
        };

        this.handleOptionInput = this.handleOptionInput.bind(this);
        this.handleOptionAddClick = this.handleOptionAddClick.bind(this);
    }

    handleOptionInput(value: string) {
        this.setState({
            optionToAdd: value
        });
    }

    handleOptionAddClick() {
        this.setState(prevState => {
            this.props.onOptionAddition(prevState.optionToAdd);
            return {optionToAdd: ''};
        });
    }

    render() {
        const {question} = this.props;
        const {optionToAdd} = this.state;

        return(
            <Form.Field className='pb-2'>
                <Input fluid action labelPosition='right' actionPosition='left'>
                    <Button icon='delete' onClick={this.props.onDeleteAction} />
                    <input placeholder='Your text goes here' value={question.text}
                           onChange={(event) => this.props.onTextChange(event.target.value)}/>
                    <Label basic>
                        <Dropdown value={question.type} options={QUESTION_TYPES}
                              onChange={(event, data) => this.props.onTypeChange(data.value ? data.value.toString() : 'TEXT')} />
                    </Label>
                </Input>
                {
                    question.type !== 'TEXT' &&
                        <>
                            <List divided verticalAlign='middle' className='mt-1 mb-1'>
                                {
                                    question.options.map((option, index) =>
                                        <List.Item key={index} className='pt-1 pb-1'>
                                            <List.Content floated='right'>
                                                <Icon name='delete' link onClick={() => this.props.onOptionRemoval(index)} />
                                            </List.Content>
                                            <List.Content className='pl-1'>{option}</List.Content>
                                        </List.Item>
                                    )
                                }
                            </List>
                            <Form.Input fluid size='mini' action={<Button basic icon onClick={this.handleOptionAddClick}><Icon name='add'/></Button>}
                                placeholder='Add an option' value={optionToAdd} onChange={(event) => this.handleOptionInput(event.target.value)} />
                        </>
                }
            </Form.Field>
        );
    }

}

export default QuestionFormField;