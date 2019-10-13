
const deployConfig = {
    apiUrl: '&&apiUrl&&'.startsWith('&&') ? null : '&&apiUrl&&'
};

export const config = {
    apiUrl: deployConfig.apiUrl || 'https://survey-panda-api.herokuapp.com'
};
