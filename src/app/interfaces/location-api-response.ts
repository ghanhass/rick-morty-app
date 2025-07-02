import { ApiInfo } from "./api-info";
import { Location } from "./location/location";

export interface LocationApiResponse {
    info: ApiInfo;
    results: Array<Location>;
}
