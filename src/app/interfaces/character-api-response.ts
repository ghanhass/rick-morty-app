import { ApiInfo } from "./api-info";
import { Character } from "./character/character";

export interface CharacterApiResponse {
    info: ApiInfo;
    results: Array<Character>;
}
