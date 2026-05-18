import type { Station } from "../types/station";

export async function getAmtrakStations() {
    let data: apiResponse = await (await fetch(`https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_Amtrak_Stations/FeatureServer/0/query?${new URLSearchParams({
            where: "1=1",
            outFields: "StaType,StnType,Name,Code,StationName,StationFacilityName,StationAliases,City",
            outSR: "4326",
            f: "json"
        })}`)).json() as apiResponse;

    // let stations: Array<Station> = [];

    // for (let featuresMember of data.features) {
    //     const stations: Station[] = data.features.map(({ attributes }) => ({
    //         city: attributes.City,
    //         stationName: attributes.Name,
    //         stationCode: attributes.Code,
    //         priority: 0,
    //     }));
    //     stations.push(newStation);
    // }

    const stations: Station[] = data.features.map(({ attributes }) => ({
        city: attributes.StationName,
        stationName: !(attributes.Name === " ") ? attributes.Name : attributes.City,
        stationCode: attributes.Code,
        priority: 0,
    }));

    return stations;
}

interface apiResponse {
    features: Array<{
        attributes: attributes;
    }>
}

interface attributes {
    StaType: string;
    StnType: string;
    Name: string;
    Code: string;
    StationName: string;
    StationFacilityName: string;
    StationAliases: string,
    City: string;
}