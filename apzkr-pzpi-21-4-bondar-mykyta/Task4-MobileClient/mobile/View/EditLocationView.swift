import SwiftUI

struct EditLocationView: View {
    @State var name: String = ""
    @State var description: String = ""
    @State var country: String = ""
    @State var city: String = ""
    
    @State private var isLoading = false
    @State private var currentAlert: AlertType?
    @Environment(\.presentationMode) var presentationMode
    
    let locId: Int
    let accessToken: String
    
    enum AlertType: Identifiable {
        case error(String)
        case success
        
        
        var id: String {
            switch self {
            case .error(let message):
                return "error-\(message)"
            case .success:
                return "success"
             
            }
        }
    }
    
    var body: some View {
        VStack {
            Text("Edit Location")
                .font(.largeTitle)
                .foregroundColor(.primary)
                .bold()
            
            Image("edit")
                .resizable()
                .scaledToFit()
            
            CustomTextField(name: $name, textField: "Name")
            CustomTextField(name: $description, textField: "Description")
            CustomTextField(name: $country, textField: "Country")
            CustomTextField(name: $city, textField: "City")
            
            if isLoading {
                ProgressView()
                    .padding()
            }
            
            Button(action: saveChanges) {
                Text("Save Changes")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.main)
                    .cornerRadius(15)
            }
            .padding(.horizontal)
        }
        .onAppear {
            fetchLocationInfo()
        }
        .alert(item: $currentAlert) { alertType in
            switch alertType {
            case .error(let message):
                return Alert(
                    title: Text("Error"),
                    message: Text(message),
                    dismissButton: .default(Text("OK"))
                )
            case .success:
                return Alert(
                    title: Text("Success"),
                    message: Text("Location updated successfully."),
                    dismissButton: .default(Text("OK")) {
                        presentationMode.wrappedValue.dismiss()
                    }
                )
            }
        }
    }
    
    private func fetchLocationInfo() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/locations/\(locId)/") else {
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    self.currentAlert = .error("Failed to load data: \(error.localizedDescription)")
                    return
                }
                
                guard let data = data else {
                    self.currentAlert = .error("No data received.")
                    return
                }
                
                do {
                    let locationInfo = try JSONDecoder().decode(Location.self, from: data)
                    self.name = locationInfo.name
                    self.description = locationInfo.description
                    self.country = locationInfo.country
                    self.city = locationInfo.city
                } catch {
                    self.currentAlert = .error("Failed to decode data: \(error.localizedDescription)")
                }
            }
        }.resume()
    }
    
    private func saveChanges() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/locations/\(locId)/") else {
            return
        }
        
        guard let jsonData = try? JSONEncoder().encode(LocationUpdate(name: name, description: description, country: country, city: city)) else {
            self.currentAlert = .error("Failed to encode data.")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = jsonData
        
        isLoading = true
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                self.isLoading = false
                
                if let error = error {
                    self.currentAlert = .error("Failed to update location: \(error.localizedDescription)")
                    return
                }
                
                guard let response = response as? HTTPURLResponse, response.statusCode == 200 else {
                    self.currentAlert = .error("Failed to update location. Status code: \(String(describing: (response as? HTTPURLResponse)?.statusCode))")
                    return
                }
                
                self.currentAlert = .success
            }
        }.resume()
    }
    
}

 

struct LocationUpdate: Codable {
    let name: String
    let description: String
    let country: String
    let city: String
}

 

#Preview {
    EditLocationView(locId: 38, accessToken: "your_access_token_here")
}
