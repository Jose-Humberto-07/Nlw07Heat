import axios from "axios";

/**
 * Receber code(string)
 * Recuperar o acess_token no github
 * Verificar se o suário existe no DB
 *  se sim = gerar um tohen
 *  se nao = cria no DB e gera um token
 * retornar um token com as insfros de user
 */

class AuthenticateUserService {
    async execute(code: string) {
        const url = "http://github.com/login/oauth/access_token";

        const response = await axios.post(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                clien_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Aceept": "application/joson"
            }
        })


        return response.data;
    }
}

export { AuthenticateUserService }