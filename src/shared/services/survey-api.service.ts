import {config} from '../../config';

class SurveyApiService {

    private readonly basePath: string;

    constructor(basePath: string) {
        this.basePath = basePath;
    }

    async checkHealth(): Promise<string> {
        const url = new URL(`${this.basePath}/health`);

        const response = await fetch(url.toString(), {
            method: 'GET'
        });

        return (response && response.ok) ? response.text() : Promise.reject(`${response.status}: ${response.statusText}`);
    }
}

export default new SurveyApiService(config.apiUrl);
