
import Combine
import Foundation


class LocationInfoViewModel: ObservableObject{
    @Published var errorMessage: String?
    @Published var locationInfo: [LocationInfo] = []
    @Published var isLoading: Bool = true
    private var cancellables = Set<AnyCancellable>()
    private var accessToken: String
    private var locId: Int
    
    
    init(locId: Int, accessToken: String){
        self.locId = locId
        self.accessToken = accessToken
        fetchLocationInfo()
    }
    
    func fetchLocationInfo() {
        isLoading = true
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/locations-data/?id=\(locId)") else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTaskPublisher(for: request)
            .map { $0.data }
            .decode(type: [LocationInfo].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .sink { [weak self] completion in
                switch completion {
                case .failure(let error):
                    self?.errorMessage = error.localizedDescription
                    print(error)
                case .finished:
                    break
                }
            } receiveValue: { [weak self] fetchedLocationInfo in
                self?.locationInfo = fetchedLocationInfo
                print(fetchedLocationInfo)
                self?.isLoading = false
            }
            .store(in: &cancellables)
    }
}
