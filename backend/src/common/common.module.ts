import { Module } from "@nestjs/common";
import { CommonController } from "./common.controller";
import { CommonService } from "./common.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { RolesGuard } from "./guards/roles.guard";

@Module({
    controllers:[CommonController],
    providers: [CommonService,JwtAuthGuard,RolesGuard],
    exports: [CommonService,JwtAuthGuard,RolesGuard]
})
export class CommonModule{}