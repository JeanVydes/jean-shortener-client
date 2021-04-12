import Axios, { AxiosResponse } from 'axios';
import Config from '../config.json';

export const api_url: string = Config.production ? "https://jsapi.jeancarlosvr.repl.co" : "http://localhost:5000"; 
export const routes: any = {
    _: "/",
    createUser: "/api/v1/post/user/create",
    getMe: "/api/v1/post/all/user",
    getUser: "/api/v1/get/public/user",
    requestCredentials: "/api/v1/post/user/request/credentials",
    createShortenedURL: "/api/v1/post/shortener/create",
    deleteShortenedURL: "/api/v1/post/shortener",
    getShortenedURL: "/api/v1/get/shortener",
    getDataForDashboard: "/api/v1/post/user/data/dashboard"
}

export async function createUser(data: {
    username: string
    name: string
    email: string
    password: string
    confirm_password: string
}): Promise<any> {
    const _r: AxiosResponse = await Axios({
        url: `${api_url}${routes.createUser}`,
        method: "POST",
        data
    });

    return _r.data;
}

export async function getMe(data: {
    id: string,
    token: string
}): Promise<any> {
    const _r: AxiosResponse = await Axios({
        url: `${api_url}${routes.getMe}/${data.id}`,
        method: "POST",
        data: {
            token: data.token
        }
    });

    return _r.data;
}

export async function getUser(data: {
    id: string
}): Promise<any> {
    const _r: AxiosResponse = await Axios({
        url: `${api_url}${routes.getUser}/${data.id}`,
        method: "GET"
    });

    return _r.data;
}

export async function signIn(data: {
    username_email: string
    password: string
}) {
    const _r: AxiosResponse = await Axios({
        url: `${api_url}${routes.requestCredentials}`,
        method: "POST",
        data
    });

    return _r.data;
}

export async function createShortenedURL(data: {
    user_id: string | any
    user_token: string | any
    url: string
    is_vanity: boolean
    vanity_url: string | null
}) {
    const _r: AxiosResponse = await Axios({
        url: `${api_url}${routes.createShortenedURL}`,
        method: "POST",
        data
    });

    return _r.data;
}

export async function deleteShortenedURL(data: {
    user_id: string
    token: string
    code: string
}) {
    const _r: AxiosResponse = await Axios({
        url: `${api_url}${routes.deleteShortenedURL}/${data.code || null}/delete`,
        method: "DELETE",
        data: {
            user_id: data.user_id || null,
            token: data.token || null
        }
    });

    return _r.data;
}

export async function getShortenedURL(data: {
    shortenerID: string
}) {
    const _r: AxiosResponse = await Axios({
        url: `${api_url}${routes.getShortenedURL}/${data.shortenerID || 0}/data`,
        method: "GET"
    });

    return _r.data;
}

export async function getDataForDashboard(data: {
    id: string
    token: string
}) {
    const _r: AxiosResponse = await Axios({
        url: `${api_url}${routes.getDataForDashboard}/${data.id || "id"}`,
        method: "POST",
        data: {
            token: data.token || null
        }
    });

    return _r.data;
}