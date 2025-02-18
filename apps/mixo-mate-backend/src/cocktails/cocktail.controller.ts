import { Controller, Get, Path, Route, Security } from "tsoa";
import { CocktailService } from "./cocktail.service.js";
import { Cocktail } from "./cocktail.dto.js";

@Route("cocktails")
@Security("mixio_auth")
export class CocktailController extends Controller {
  @Get()
  public async getCocktails(): Promise<Cocktail[]> {
    return new CocktailService().getAll();
  }

  @Get('/{cocktailId}')
  public async getCocktail(
    @Path() cocktailId: string
  ): Promise<Cocktail> {
    return new CocktailService().getById(cocktailId);
  }
}
