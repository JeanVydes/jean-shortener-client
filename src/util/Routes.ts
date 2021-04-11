
import Other from '../util/Other';

const routes = {
    clientURL: "http://localhost:3000",
    shortenedURLDomain: "https://jean.host",
    _: "/",
    signIn: "/accounts/signin",
    signUp: "/accounts/signup",
    dashboard: "/dashboard",
    help: `${Other.discordSupportServer}`,
    //developers: "/help/developers",
    privacy: "/privacy",
    terms: "/terms",
    //about: "/about",
    //jobs: "/jobs",
    user: {
        dashboard: "/dashboard"
    }
}

export default routes;