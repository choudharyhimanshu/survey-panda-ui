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
}

export default new SurveyApiService(config.apiUrl);
