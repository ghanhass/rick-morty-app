import { ApiInfo } from "./api-info";
import { Character } from "./character/character";

export interface LocationApiResponse {
    info: ApiInfo;
    results: Array<Character>;
}
