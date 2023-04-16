import axios from 'axios';

class GithubInstance {
    private github = axios.create({
        baseURL: 'https://github.com/',
    });

    private githubApi = axios.create({
        baseURL: "https://api.github.com"
    });

    async getAccessToken(code: string) {
        const params = `?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`;
        const { data } = await this.github.post('/login/oauth/access_token' + params);
        return data;
    }

    async getUserData(authId: string) {
        const { data } = await this.githubApi.get('/user', {
            headers: {
                "Authorization": `Bearer ${authId}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        return data;
    }

};

export default new GithubInstance();


