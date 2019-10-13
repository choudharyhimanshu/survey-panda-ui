import {config} from '../../config';
import {Survey} from '../models/Survey';

class SurveyApiService {

    private readonly basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    static handleErrorResponse(response: Response): Promise<string> {
        switch (response.status) {
            case 404:
                return Promise.reject('[API] 404: The server can not find the requested resource.');
            case 500:
                return Promise.reject('[API] 500: The server met an unexpected condition.');
            default:
                return Promise.reject(`[API] ${response.status}: ${response.statusText}`);
        }
    }

    static sanitizeSurveyForCreation(survey: Survey): Survey {
        const newSurvey = {...survey};
        newSurvey.questions = [...survey.questions];

        delete newSurvey['id'];
        newSurvey.questions.forEach(question => delete question['id']);

        return newSurvey;
    }

    async checkHealth(): Promise<string> {
        const url = new URL(`${this.basePath}/health`);

        const response = await fetch(url.toString(), {
            method: 'GET'
        });

        return (response && response.ok) ? response.text() : SurveyApiService.handleErrorResponse(response);
    }

    async getAllSurveys(surveysBy?: string): Promise<Survey[]> {
        const url = new URL(`${this.basePath}/surveys`);

        if (surveysBy)
            url.searchParams.append('createdBy', surveysBy);

        const response = await fetch(url.toString(), {
            method: 'GET'
        });

        return (response && response.ok) ? response.json() : SurveyApiService.handleErrorResponse(response);
    }

    async createSurvey(survey: Survey): Promise<Survey> {
        const url = new URL(`${this.basePath}/surveys`);

        const headers = {
            'Content-type': 'application/json'
        };

        const sanitizedSurvey = SurveyApiService.sanitizeSurveyForCreation(survey);

        const response = await fetch(url.toString(), {
            method: 'POST',
            headers,
            body: JSON.stringify(sanitizedSurvey)
        });

        return (response && response.ok) ? response.json() : SurveyApiService.handleErrorResponse(response);
    }
}

export default new SurveyApiService(config.apiUrl);
