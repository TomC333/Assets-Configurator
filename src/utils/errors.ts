export class Errors{ 

    static FailedToFetchDirectory(){
        throw new Error(`Failed to fetch directory.`)
    }

}