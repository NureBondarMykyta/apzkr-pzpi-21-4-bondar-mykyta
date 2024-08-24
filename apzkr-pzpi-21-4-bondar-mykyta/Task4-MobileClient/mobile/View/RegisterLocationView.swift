import SwiftUI


struct LocationType: Identifiable, Codable, Hashable {
    let id: Int
    let name: String
}

struct RegisterLocationView: View {
    
    let accessToken: String
    
    @State private var name: String = ""
    @State private var description: String = ""
    @State private var country: String = ""
    @State private var city: String = ""
    @State private var locationTypes: [LocationType] = []
    @State private var selectedLocationType: LocationType?
    @State private var selectedLocationTypeId: Int?
    
    @State private var showAlert = false
    @State private var alertMessage = ""
    @State private var shouldNavigateToDashboard = false
    
    var body: some View {
        NavigationStack {
            VStack {
                Text("Add own location!")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.main)
                    .padding()
                
                Image("walking2")
                    .resizable()
                    .scaledToFit()
                
                CustomTextField(name: $name, textField: "Location name")
                CustomTextField(name: $description, textField: "Description")
                CustomTextField(name: $country, textField: "Country")
                CustomTextField(name: $city, textField: "City")
                
                if !locationTypes.isEmpty {
                    Picker("Select Location Type", selection: $selectedLocationType) {
                        ForEach(locationTypes) { type in
                            Text(type.name).tag(type as LocationType?)
                        }
                    }
                    .onChange(of: selectedLocationType) { newValue in
                        selectedLocationTypeId = newValue?.id
                    }
                    .cornerRadius(15)
                    .padding(.bottom, 10)
                    .frame(maxWidth: .infinity)
                    .padding(.horizontal)
                    .pickerStyle(.wheel)
                }
                
                Spacer()
                
                Button {
                    createNewLocation()
                } label: {
                    Text("Add location")
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(.white)
                }
                .padding(.vertical)
                .frame(maxWidth: .infinity)
                .background(Color.main)
                .cornerRadius(15)
                .padding()
                
                NavigationLink(
                    destination: UserDashboardView(accessToken: accessToken),
                    isActive: $shouldNavigateToDashboard
                ) {
                    EmptyView()
                }
            }
            .onAppear {
                fetchLocationTypes()
            }
            .alert(isPresented: $showAlert) {
                Alert(
                    title: Text("Message"),
                    message: Text(alertMessage),
                    dismissButton: .default(Text("OK"))
                )
            }
        }
    }
    
    private func fetchLocationTypes() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/locations-types/") else {
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                DispatchQueue.main.async {
                    self.alertMessage = "Error when getting location types: \(error.localizedDescription)"
                    self.showAlert = true
                }
                return
            }
            
            guard let data = data else {
                DispatchQueue.main.async {
                    self.alertMessage = "No data received"
                    self.showAlert = true
                }
                return
            }
            
            do {
                let decodedResponse = try JSONDecoder().decode([LocationType].self, from: data)
                DispatchQueue.main.async {
                    self.locationTypes = decodedResponse
                }
            } catch {
                DispatchQueue.main.async {
                    self.alertMessage = "Error decoding the response: \(error.localizedDescription)"
                    self.showAlert = true
                }
            }
        }.resume()
    }
    
    private func createNewLocation() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/locations/") else { return }
        let body: [String: Any] = [
            "name": name,
            "description": description,
            "country": country,
            "city": city,
            "location_type": selectedLocationTypeId ?? 0
        ]
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                DispatchQueue.main.async {
                    self.alertMessage = "Erorr: \(error.localizedDescription)"
                    self.showAlert = true
                }
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 201 {
                DispatchQueue.main.async {
                    self.alertMessage = "The location has been successfully added!"
                    self.showAlert = true
                    self.shouldNavigateToDashboard = true
                }
            } else {
                DispatchQueue.main.async {
                    self.alertMessage = "The location could not be added. Status code: \((response as? HTTPURLResponse)?.statusCode ?? 0)"
                    self.showAlert = true
                }
            }
        }
        
        task.resume()
    }
}

#Preview {
    RegisterLocationView(accessToken: "TOken")
}
