import { getAmtrakStations } from "./sources/amtrak";
import { getChinaStations } from "./sources/china";
import type { Station } from "./types/station";
import papaparse = require('papaparse')

export async function agregateData(): Promise<Station[]> {
    let data: Station[] = Array.prototype.concat(...await Promise.all([
        getAmtrakStations(),
        getChinaStations(),
    ]))

    return data;
}

export async function writeData() {
    let data: Station[] = await agregateData();

    try {
        Bun.write('./stations.json', JSON.stringify(data, null, 2))
        Bun.write('./stations.csv', papaparse.unparse({
            fields: [
                "city",
                "stationID",
                "stationName",
                "aliases",
                "translations",
                "stationCode",
                "longerStationCode",
                "altCodes",
                "priority",
            ],
            data: convertAllTranslationsToJSON(data),
        }))
    } catch (error) {
        console.error(error)
    }
    
}

function convertAllTranslationsToJSON(dataToConvert: Station[]): object[] {
    let newStationsArray: object[] = [];
    
    for (let station of dataToConvert) {
        let newStation: any = station;

        if (station.translations) {
            newStation.translations = papaparse.unparse(station.translations, {
                header: false,
            });
        }

        newStationsArray.push(newStation as object)
    }

    return newStationsArray
}

writeData()