import supertest from 'supertest';

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";


type HTTPMETHODS = 'GET' | 'POST' | 'PUT';
interface HEADERS {
    key: string
    value: string
};

interface OPTS {
    endPoint: string,
    reqBody: object
};

const apiManager = async (method: HTTPMETHODS, opts: OPTS, extraHeaders: HEADERS[]) => {

    let headers = extraHeaders.map(header => ({
        [header.key]: header.value,
    }));

    switch (method) {
        case 'GET':
            return supertest(BASE_URL)
                .get(opts.endPoint)
                .retry(2)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set(headers);
        case 'POST':
            return supertest(BASE_URL)
                .post(opts.endPoint)
                .retry(2)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set(headers)
                .send(opts.reqBody);
        case 'PUT':
            return supertest(BASE_URL)
                .put(opts.endPoint)
                .retry(2)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .set(headers)
                .send(opts.reqBody);
    }
}

export default apiManager;