//Module
import {Global, Module} from "@nestjs/common";
import {GlobalService} from "./global.service";
@Global()
@Module({
  imports:[],
  exports:[GlobalService],
  providers:[GlobalService],
})
export class GlobalModule {}