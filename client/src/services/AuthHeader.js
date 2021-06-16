export default function authHeader() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.token) {
        return { "Authorization": `${user.token.token_type} ${user.token.access_token}` };
    } else {
        return {};
    }
}
