import papaparse = require('papaparse')
import type { Station } from '../types/station';

export async function getChinaStations(): Promise<Station[]> {
    let response = await fetch("https://kyfw.12306.cn/otn/resources/js/framework/station_name.js")
    .then((response) => response.text());
    
    let data: string = response.substring(
        response.indexOf("'") + 1,
        response.lastIndexOf("'")
    )

    data = "atCode|chineseStationName|chinese3LetterCode|englishName|english3LetterCode|id|Otherid|chineseCityName|||" + data;

    data = data.replaceAll("|||", "\n");

    let formattedData: response[] = papaparse.parse(data, {header: true, dynamicTyping: {
            "id": true,
            "Otherid": true,
        }
    },).data as response[]

   const stations: Station[] = await Promise.all(
    formattedData.map(async (row) => ({
        stationID: row.Otherid,

        stationName: row.englishName
            ? row.englishName.charAt(0).toUpperCase() + row.englishName.slice(1)
            : await (await fetch("http://api.geonames.org/search?" + row.chineseStationName)).text(),

        translations: [{
            langCode: "zh",
            cityName: row.chineseCityName,
            stationName: row.chineseStationName,
        }],

        altCodes: [row.chinese3LetterCode],

        stationCode: row.englishName
            ? row.english3LetterCode.toUpperCase()
            : row.chinese3LetterCode,

        priority: 0,
    })));

    return stations;
}

interface response {
    atCode: string,
    chineseStationName: string,
    chinese3LetterCode: string,
    englishName: string,
    english3LetterCode: string,
    id: number,
    Otherid: number,
    chineseCityName: string,
}

//console.log(await getChinaStations())