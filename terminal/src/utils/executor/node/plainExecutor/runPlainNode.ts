import { exec } from "child_process";
import path from 'path';
import fs from 'fs'
import { fileRemoveExecutor } from "../../../worker/removeExecutor";
import vm from 'vm';
//import { NodeVM } from 'vm2'
const filePath = path.resolve(__dirname);

export const runPlainNodeCode = async (code: string, reqId: string) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(`${filePath}/${reqId}.js`, code, function (err) {
            if (err) throw err;

            exec(`node ${path.resolve(filePath, `${reqId}.js`)}`, (error, stdout, stderr) => {
                setTimeout(() => fileRemoveExecutor(`${path.resolve(filePath, `${reqId}.js`)}`), 0);
                if (stderr) {
                    const updatedResponse = "/index.js" + stderr.split(reqId)[1];
                    return resolve(updatedResponse);
                }
                return resolve(stdout);
            });

        });
    })
};

export const VMExecution = async (code: string, reqId: string) => {
    return new Promise((resolve, reject) => {

        try {

            const consoleStatements = [];
            const contextObj = {
                console: {
                    log: (args: []) => {
                        consoleStatements.push(args)
                    }
                },
                setTimeout,
                setImmediate,
                setInterval
            };
            const vmContext =  vm.createContext(contextObj);
            const script = new vm.Script(`${code}`);
            script.runInContext(vmContext);
            // const context = { setTimeout,console } // just for info, otherwise setTimeout is there in new context without it too
            // vm.runInNewContext(code, context); 
            // console.log("hey here", consoleStatements);
            // console.log("___________________________________________________")
            const singleStatement = consoleStatements.join('\n');
            resolve(singleStatement)
        } catch (error) {
            console.log("error");
            resolve(error?.toString());
        }
    })
}