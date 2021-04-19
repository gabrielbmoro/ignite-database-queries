import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("game")
      .where("lower(game.title) like lower(:name)", { name: `%${param}%` })
      .getMany(); // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("select count (*) from games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository
      .createQueryBuilder("game")
      .where("game.id = :gameId", { gameId: id })
      .innerJoinAndSelect("game.users", "user")
      .getOne();
    return game?.users ? game?.users : []; // Complete usando query builder
  }
}
