import Foundation

struct LoginResponse: Decodable {
    let access: String
    let refresh: String
}
