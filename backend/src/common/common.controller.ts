import { Controller,Get } from "@nestjs/common";
import { CommonService } from "./common.service";

@Controller('health')
export class CommonController{
    constructor(private readonly commonService: CommonService){}

    @Get()
    check() {
        return this.commonService.getHealth();
    }

}
