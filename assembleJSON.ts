import { getAmtrakStations } from "./sources/amtrak";
import { getChinaStations } from "./sources/china";
import type { Station } from "./types/station";


let data: Station[] = Array.prototype.concat(...await Promise.all([
    getAmtrakStations(),
    getChinaStations(),
]))

Bun.write('./stations.json', JSON.stringify(data, null, 2))