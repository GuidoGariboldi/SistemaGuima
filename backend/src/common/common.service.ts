import { Injectable } from "@nestjs/common";



@Injectable()
export class CommonService{
    getHealth(){
        return{
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        }
    }
}