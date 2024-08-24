

import Foundation

struct Parameter: Decodable {
    let parameterName: String
    let unit: String
    let weight: Double
    let maxValue: Double

    private enum CodingKeys: String, CodingKey {
        case parameterName = "parameter_name"
        case unit
        case weight
        case maxValue = "max_value"
    }
}

struct MonitoringData: Decodable {
    let parameter: Parameter
    let value: Double
    let updateTime: String

    private enum CodingKeys: String, CodingKey {
        case parameter
        case value
        case updateTime = "update_time"
    }
}

struct LocationInfo: Decodable {
    let id: Int
    let monitoringData: [MonitoringData]
    let aqi: Double

    private enum CodingKeys: String, CodingKey {
        case id
        case monitoringData = "monitoring_data"
        case aqi = "AQI"
    }
}
