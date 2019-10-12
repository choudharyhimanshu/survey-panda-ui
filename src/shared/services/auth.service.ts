import {UserInfo} from '../models/UserInfo';
import {CACHE_KEYS} from '../../constants';

class AuthService {

    async getUserInfo(): Promise<UserInfo> {
        const userInfoCache = sessionStorage.getItem(CACHE_KEYS.USER_INFO);
        if (userInfoCache) {
            return Promise.resolve(JSON.parse(userInfoCache));
        }
        return Promise.reject('User Info not found.');
    }

    async setUserInfo(userInfo: UserInfo): Promise<string> {
        sessionStorage.setItem(CACHE_KEYS.USER_INFO, JSON.stringify(userInfo));
        return Promise.resolve('Login Successful.');
    }

    async clearUserInfo(): Promise<string> {
        sessionStorage.setItem(CACHE_KEYS.USER_INFO, JSON.stringify(null));
        return Promise.resolve('Logout Successful.');
    }

}

export default new AuthService();
