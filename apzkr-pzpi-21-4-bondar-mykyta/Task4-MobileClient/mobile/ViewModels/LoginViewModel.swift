import SwiftUI
import Combine

class LoginViewModel: ObservableObject {
    @Published var username = ""
    @Published var password = ""
    @Published var isAuthenticated = false
    @Published var errorMessage: String?
    @Published var accessToken: String?
    @Published var refreshToken: String?

    private var cancellables = Set<AnyCancellable>()
    
    func login() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/token/") else {
            print("Invalid URL")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let body: [String: String] = ["username": username, "password": password]
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        
        URLSession.shared.dataTaskPublisher(for: request)
            .map { $0.data }
            .handleEvents(receiveSubscription: { _ in
                print("Starting request...")
            }, receiveOutput: { data in
                print("Received data: \(String(describing: String(data: data, encoding: .utf8)))")
            }, receiveCompletion: { completion in
                print("Request completed: \(completion)")
            })
            .decode(type: LoginResponse.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                case .failure(let error):
                    print("Error: \(error.localizedDescription)")
                    self?.errorMessage = error.localizedDescription
                case .finished:
                    print("Request finished successfully")
                }
            } receiveValue: { [weak self] response in
                print("Received response: \(response)")
                self?.accessToken = response.access
                self?.refreshToken = response.refresh
                self?.isAuthenticated = true
                self?.errorMessage = nil
            }
            .store(in: &cancellables)
    }
}
