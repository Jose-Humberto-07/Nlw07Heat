
import axios from "axios";

import prismaClient from "../prisma"
import { sign } from "jsonwebtoken";

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
        });

        const response = await axios.get<IUserResponse>("http://api.github.com/user", {
            headers: {
                authorization: `Bearer ${accessTokenRespose.access_token}`
            }
        });

        const { login, id, avatar_url, name } = response.data

        let user = await prismaClient.user.findFirst({
             where: {
                 github_id: id
             }
        });

        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            });
        }

        const token = sign(
            {
                user: {
                    name: user.name,
                    avatar_url:user.avatar_url,
                    id: user.id,
                }
            },
            process.env.JWT_SECRET,
            {
                subject: user.id,
                expiresIn: "1d"
            }
        );


        return { token, user};
    }
}

export { AuthenticateUserService }