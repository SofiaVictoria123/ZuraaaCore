import { Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Request } from "@nestjs/common";
import { Body, Query } from "@nestjs/common/decorators/http/route-params.decorator";
import { BotService } from "src/modules/bots/bot.service";
import CreateBotDto from "src/modules/bots/dtos/created-edited/bot.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RequestUserPayload } from "../auth/jwt.payload";

@Controller('bots')
export default class BotController{
    constructor(private readonly botService: BotService){}

    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') showAvatar: boolean){
        const bot =  this.botService.show(id, showAvatar, true)
        if(!bot)
            throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)

        return bot
    }

    @Get()
    async showAll(@Query("sort") organizar: string,  @Query("search") pesquisa: string, @Query("page") pagina: number, @Query("limit") limit: string /* eu ja expliquei isso na outra classe */){
        return this.botService.showAll(organizar, pesquisa, pagina, limit);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async add(@Body() bot: CreateBotDto, @Request() req: Express.Request){
        return this.botService.add(bot, req.user as RequestUserPayload)
    }
}