
export interface HttpResponse {
    success: boolean
    message: string 
    code : number
}

export const PONG = new Promise((r) => r({
    success: true , 
    message : "pong", 
    code: 200}
));

export const NOT_IMPLEMENTED_YET = new Promise<HttpResponse>((r) => r({
    success: false, 
    message:"Not implemented yet.", 
    code : 404
}));

export const MISSING_PARAMETERS = new Promise<HttpResponse>((r) => r({
    success: false, 
    message:"Missing parameters.", 
    code : 400
}));

export const INCORRECT_CREDENTIALS = new Promise<HttpResponse>((r) => r({
    success: false, 
    message:"Incorrect credentials.", 
    code : 403
}));

export const SOMETHING_WENT_WRONG = new Promise<HttpResponse>((r) => r({
    success: false, 
    message: "Something went wrong.", 
    code : 500
})); 