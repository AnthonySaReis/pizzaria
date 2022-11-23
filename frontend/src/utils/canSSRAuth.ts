import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";
//função para página que somente logados tem acesso
export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> =>{
        const cookies = parseCookies(ctx);

        const token = cookies['@nextauth.token'];

        //não tem token de autenticação de login, volta pra tela de login
        if(!token){
            return{
                redirect:{
                    destination: '/',
                    permanent: false
                }
            }
        }
        //tem token passa
        try{
            return await fn(ctx);
        }
        //se der erro pelo cookie, destroi o token e manda pra tela de login
        catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@nextauth.token');

                return{
                    redirect:{
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
    }
}

