export type Station = {
    city?: string;
    stationID?: number;
    stationName: string
    translations?: translation[];
    stationCode: string;
    altCodes?: string[]
    sixLetterStationCode?: string;
    priority: number; // How high to prioritize the code, 0 is the code the operator uses, 1 is Secondary Operator, 2 is agregator, 3 is IATA
}

export type translation = {
    langCode: string;
    stationName?: string;
    cityName?: string;
}