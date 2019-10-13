
const deployConfig = {
    apiUrl: '&&apiUrl&&'.startsWith('&&') ? null : '&&apiUrl&&'
};

export const config = {
    apiUrl: deployConfig.apiUrl || 'http://localhost:8080'
};
