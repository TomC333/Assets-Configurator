import { Errors } from "../utils/errors";
import { Queue } from "../utils/queue";

export class AssetsPathGenerator{

    /**
     * Retrieves all files contained within the received directory and its subdirectories.
     * 
     * @param dirPath The directory path from which to retrieve files.
     * @returns A promise that resolves to an array of file paths.
     */
    static async getAllFiles(dirPath: string): Promise<string[]>{
        const files: string[] = [];
        const queue = new Queue<string>();

        queue.enqueue(dirPath);

        while(!queue.isEmpty()){
            const currentDir =  queue.dequeue()!;
            
            const response = await fetch(currentDir);
            if(!response.ok){
                Errors.FailedToFetchDirectory();
            }
            
            const text = await response.text();
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, 'text/html');
            const links = Array.from(htmlDocument.querySelectorAll('a'));

            for(const link of links){
                const href = link.getAttribute('href');
                const fullPath = `${dirPath}/${href}`;

                if(href === null || href === "." || href === ".."){
                    continue;
                }

                if(href.endsWith('/')){
                    queue.enqueue(fullPath);
                }else{
                    files.push(fullPath);
                }
            }
        }

        return files;
    }

}