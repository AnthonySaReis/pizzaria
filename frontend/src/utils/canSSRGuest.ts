import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"

//função para páginas que so visitantes tem acesso
export function canSSRGuest<P>(fn:GetServerSideProps<P>){

    return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);


        //tentar acessar tendo conta logada, redireciona 
        if(ctx['@netxauth.token']){
            return{
                redirect:{
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        };

        return await fn(ctx);
    }

}  
  