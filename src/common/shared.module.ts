//Module
import {Global, Module} from "@nestjs/common";
import {FetchService} from "./fetch.service";
import {BcryptService } from "./bcrypt.service";

@Global()
@Module({
  imports:[],
  exports:[FetchService, BcryptService],
  providers:[FetchService, BcryptService],
})

export class SharedModule {}