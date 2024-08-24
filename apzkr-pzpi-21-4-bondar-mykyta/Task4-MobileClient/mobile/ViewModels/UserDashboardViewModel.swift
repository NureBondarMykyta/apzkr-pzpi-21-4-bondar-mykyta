import SwiftUI
import Combine

class UserDashboardViewModel: ObservableObject {
    
    @Published var user: User?
    @Published var resp: LoginResponse?
    @Published var locations: [Location] = []
    @Published var errorMessage: String?
    

    private var cancellables = Set<AnyCancellable>()
    private var accessToken: String
    
    init(accessToken: String) {
        self.accessToken = accessToken
        fetchCurrentUser()
        fetchUserLocations()
        
    }
    
    func fetchCurrentUser() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/users/current_user/") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        print("fetch userrrrr")
        
        URLSession.shared.dataTaskPublisher(for: request)
            .map { $0.data }
            .handleEvents(receiveOutput: { data in
                    if let jsonString = String(data: data, encoding: .utf8) {
                        print("Raw JSON response: \(jsonString)")
                    }
                })
            .decode(type: User.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                case .failure(let error):
                    self?.errorMessage = error.localizedDescription
                    print("Error:" + error.localizedDescription)
                case .finished:
                    print("Received response: \(request)")
                    break
                }
            } receiveValue: { [weak self] fetchedUser in
                self?.user = fetchedUser
                print(fetchedUser)
                
            }
            .store(in: &cancellables)
    }
    
    func fetchUserLocations() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/locations/") else { return }
        print("fetching")
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTaskPublisher(for: request)
            .map { $0.data }
            .decode(type: [Location].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                case .failure(let error):
                    self?.errorMessage = error.localizedDescription
                case .finished:
                    break
                }
            } receiveValue: { [weak self] fetchedLocations in
                self?.locations = fetchedLocations
            }
            .store(in: &cancellables)
    }
}
