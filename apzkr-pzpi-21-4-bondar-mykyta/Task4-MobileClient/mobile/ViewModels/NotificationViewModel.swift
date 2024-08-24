import Foundation
import Combine

class NotificationViewModel: ObservableObject {
    @Published var notifications: [Notification] = []
    @Published var isLoading = false
    @Published var errorMessage: String? = nil
    @Published var hasNotifications = false
    
    var accessToken: String
    private var cancellables = Set<AnyCancellable>()
    
    init(accessToken: String) {
        self.accessToken = accessToken
        fetchNotifications()
    }
    
    func fetchNotifications() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/location-notifications/") else {
            self.errorMessage = "Неправильный URL"
            return
        }
        
        var request = URLRequest(url: url)
        request.addValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        isLoading = true
        
        URLSession.shared.dataTaskPublisher(for: request)
            .tryMap { result -> [Notification] in
                guard let httpResponse = result.response as? HTTPURLResponse,
                      httpResponse.statusCode == 200 else {
                    throw URLError(.badServerResponse)
                }
                return try JSONDecoder().decode([Notification].self, from: result.data)
            }
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                self?.isLoading = false
                if case .failure(let error) = completion {
                    self?.errorMessage = error.localizedDescription
                }
            } receiveValue: { [weak self] notifications in
                self?.notifications = notifications
                self?.hasNotifications = !notifications.isEmpty   
            }
            .store(in: &cancellables)
    }
}
