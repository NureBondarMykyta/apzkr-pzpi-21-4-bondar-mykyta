import Foundation

struct Notification: Identifiable, Codable {
    let id: Int
    let content: String
    let createdDate: String
    let location: Int
    
    enum CodingKeys: String, CodingKey {
        case id
        case content
        case createdDate = "created_date"
        case location
    }
}
