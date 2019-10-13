export interface IQuestion {
    id: string;
    options: string[];
    required: boolean;
    text: string;
    type: string;
}

export class Survey {
    id: string;
    title: string;
    tags: string[];
    createdBy: string;
    createdOn: Date;
    questions: IQuestion[];

    constructor(id: string, title: string, tags: string[], createdBy: string, createdOn: Date, questions: IQuestion[]) {
        this.id = id;
        this.title = title;
        this.tags = tags;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.questions = questions;
    }
}
