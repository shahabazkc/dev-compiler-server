import { log } from "@dev-compiler/common";
import { Worker } from "worker_threads"
import path from "path";

const filePath = path.resolve(__dirname);

export const fileRemoveExecutor = async (fileDir: string) => {
    const worker = new Worker(`${filePath}/fileRmWorker.${process.argv[1]?.includes('app.ts') ? 'ts' : 'js'}`, { workerData: { filePath: fileDir } });
    worker.on('message', (data) => {
        log.info(`${data}`);
        return;
    });
    worker.on('error', (err) => {
        log.error(err);
        return;
    });
    worker.on('exit', (exitcode) => {
        log.info(`exit workerCode: ${exitcode}`);
        return;
    });
}