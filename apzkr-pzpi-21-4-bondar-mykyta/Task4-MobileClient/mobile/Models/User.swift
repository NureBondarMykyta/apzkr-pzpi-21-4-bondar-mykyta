import Foundation

struct User: Decodable {
    let id: Int
    let username: String
    let firstName: String
    let lastName: String
    let email: String
    let isStaff: Bool
    let isActive: Bool
    let dateJoined: String
    let gender: String
    let birthDate: String
    let paymentKey: String?
    let allPaymentKeys: [String]
    
    enum CodingKeys: String, CodingKey {
        case id
        case username
        case firstName = "first_name"
        case lastName = "last_name"
        case email
        case isStaff = "is_staff"
        case isActive = "is_active"
        case dateJoined = "date_joined"
        case gender
        case birthDate = "birth_date"
        case paymentKey = "payment_key"
        case allPaymentKeys = "all_payment_keys"
    }
}
