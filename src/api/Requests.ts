import Axios, { AxiosResponse } from 'axios';

export const api_url: string = "http://localhost:5000";
export const routes: any = {
    _: "/",
    createUser: "/api/v1/post/user/create",
    getMe: "/api/v1/post/public/user",
    getUser: "/api/v1/get/public/user",
    requestCredentials: "/api/v1/post/user/request/credentials"
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