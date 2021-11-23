import { serverHttp } from "./app";



serverHttp.listen(4000, () => {
    console.log("Servidor rodando na porta 4000: http://localhost:4000");
});