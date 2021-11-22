import axios from "axios";

/**
 * Receber code(string)
 * Recuperar o acess_token no github
 * Verificar se o suário existe no DB
 *  se sim = gerar um tohen
 *  se nao = cria no DB e gera um token
 * retornar um token com as insfros de user
 */

interface IAccessTokenResponse {
    access_token: string
}

interface IUserResponse {
    avatar_url: string,
    login: string,
    id: number,
    name: string
}

class AuthenticateUserService {
    async execute(code: string) {
        const url = "http://github.com/login/oauth/access_token";

        const { data: accessTokenRespose } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRETS,
                code,
            },
            headers: {
                "Accept": "application/json"
            }
        })

        const response = await axios.get<IUserResponse>("http://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accessTokenRespose.access_token}`
            }
        })


        return response.data;
    }
}

export { AuthenticateUserService }