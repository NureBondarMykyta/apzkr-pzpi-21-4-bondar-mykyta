import Foundation

struct Location: Decodable, Identifiable {
    let id: Int
    let name: String
    let description: String
    let country: String
    let city: String
    let locationType: Int
    
    enum CodingKeys: String, CodingKey {
        case id, name, description, country, city
        case locationType = "location_type"
    }
}
