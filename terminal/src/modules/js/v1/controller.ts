import { ApiError, log } from '@dev-compiler/common';
import { Request, NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { runPlainNodeCode } from '../../../utils/executor/node/plainExecutor/runPlainNode';
import Docker from 'dockerode';
export default {

    executePlainCode: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { code } = req.body;
            const response = await runPlainNodeCode(code, req.reqId);
            return res.send(response);
        } catch (err) {
            log.debug("Error while login");
            log.error(err);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    },
    runServer: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const docker = new Docker();

            docker.pull('node:alpine', (err, stream) => {
                if (err) {
                    log.error(`Error while pulling image: ${JSON.stringify(err)}`);
                }

                docker.modem.followProgress(stream, onFinished, onProgress);

                function onProgress(event) {
                    log.info(`Image pull event: ${JSON.stringify(event)}`);
                }
            });

            function onFinished(err, output) {
                if (err) {
                    log.error(`Error pulling image: ${err}`);
                }
                log.info('Image pulled successfully!');
                docker.createContainer({
                    Image: 'node:alpine',
                    Cmd: ['/bin/bash', '-c', 'echo "Hello, world!"'],
                }).then(async (container) => {
                    // Start the container
                    await container.start();
                    log.info(`inside container.start(): ${JSON.stringify(container)}`);
                    return res.json({ message: "Container started" })
                }).then(container => {
                    // Wait for the container to exit
                    log.info(`after container.wait(): ${JSON.stringify(container)}`)
                    //container.wait();
                }).then(container => {
                    // Get the container's exit code
                    log.info(`inside container.inspect()`)
                    //container.inspect();
                }).then(data => {
                    log.info(`after container.inspect() ${JSON.stringify(data)}`);
                    //return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Container exited with code ${data?.State?.ExitCode}`));
                }).catch(err => {
                    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Error creating container: ${err}`));
                });
            }

        }
        catch (err) {
            log.debug("Error while running server");
            log.error(err);
            return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
        }
    }
}