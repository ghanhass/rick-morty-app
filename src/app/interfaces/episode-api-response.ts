import { ApiInfo } from "./api-info";
import { Episode } from "./episode/episode";
export interface EpisodeApiResponse {
    info: ApiInfo;
    results: Array<Episode>;
}
