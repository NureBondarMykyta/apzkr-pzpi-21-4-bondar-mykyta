import SwiftUI

struct LocationInfoView: View {
    @StateObject private var viewModel: LocationInfoViewModel
    private let accessToken: String
    private let locId: Int
    private let onLocationDeleted: () -> Void
    
    @Environment(\.presentationMode) var presentationMode
    @State private var showDeleteConfirmation = false
    @State private var showEditSheet = false
    
    init(locId: Int, accessToken: String, onLocationDeleted: @escaping () -> Void) {
        _viewModel = StateObject(wrappedValue: LocationInfoViewModel(locId: locId, accessToken: accessToken))
        self.accessToken = accessToken
        self.locId = locId
        self.onLocationDeleted = onLocationDeleted
    }
    
    var body: some View {
        VStack {
            if viewModel.isLoading {
                Text("Loading...")
                    .onAppear {
                        viewModel.fetchLocationInfo()
                    }
            } else if let locationInfo = viewModel.locationInfo.first {
                if locationInfo.monitoringData.isEmpty {
                    Text("No monitoring data available.")
                        .font(.headline)
                        .foregroundColor(.gray)
                    HStack {
                        Button(action: {
                            showEditSheet = true
                        }) {
                            Text("Edit")
                                .font(.headline)
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.blue)
                                .cornerRadius(10)
                        }
                        .padding()
                        
                        Button(action: {
                            showDeleteConfirmation = true
                        }) {
                            Text("Delete")
                                .font(.headline)
                                .foregroundColor(.white)
                                .padding()
                                .background(Color.red)
                                .cornerRadius(10)
                        }
                        .padding()
                        .alert(isPresented: $showDeleteConfirmation) {
                            Alert(
                                title: Text("Confirm Deletion"),
                                message: Text("Are you sure you want to delete this location?"),
                                primaryButton: .destructive(Text("Delete")) {
                                    deleteLocation()
                                },
                                secondaryButton: .cancel()
                            )
                        }
                    }

                } else {
                    ScrollView {
                        VStack(spacing: 15) {
                            ForEach(locationInfo.monitoringData, id: \.parameter.parameterName) { data in
                                MonitoringDataCard(monitoringData: data)
                            }
                        }
                        .padding()
                        
                        Text("Air Quality Index: \(String(format: "%.2f", locationInfo.aqi))")
                            .font(.system(size: 30, weight: .semibold))
                            .padding()
                        
                        HStack {
                            Button(action: {
                                showEditSheet = true
                            }) {
                                Text("Edit")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .padding()
                                    .background(Color.blue)
                                    .cornerRadius(10)
                            }
                            .padding()
                            
                            Button(action: {
                                showDeleteConfirmation = true
                            }) {
                                Text("Delete")
                                    .font(.headline)
                                    .foregroundColor(.white)
                                    .padding()
                                    .background(Color.red)
                                    .cornerRadius(10)
                            }
                            .padding()
                            .alert(isPresented: $showDeleteConfirmation) {
                                Alert(
                                    title: Text("Confirm Deletion"),
                                    message: Text("Are you sure you want to delete this location?"),
                                    primaryButton: .destructive(Text("Delete")) {
                                        deleteLocation()
                                    },
                                    secondaryButton: .cancel()
                                )
                            }
                        }
                        .padding()
                        .alert(isPresented: $showDeleteConfirmation) {
                            Alert(
                                title: Text("Confirm Deletion"),
                                message: Text("Are you sure you want to delete this location?"),
                                primaryButton: .destructive(Text("Delete")) {
                                    deleteLocation()
                                },
                                secondaryButton: .cancel()
                            )
                        }
                    }
                }
            } else {
                Text("No location information available.")
                    .font(.headline)
                    .foregroundColor(.gray)
            }
        }
        .navigationTitle("Location Info")
        .sheet(isPresented: $showEditSheet) {
            EditLocationView(locId: locId, accessToken: accessToken)
        }
    }
    
    private func deleteLocation() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/locations/\(locId)/") else {
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error deleting location: \(error)")
                return
            }
            
            if let response = response as? HTTPURLResponse, response.statusCode == 204 {
                print("Location deleted successfully.")
                DispatchQueue.main.async {
                    presentationMode.wrappedValue.dismiss()
                    onLocationDeleted()
                }
            } else {
                print("Failed to delete location. Status code: \(String(describing: (response as? HTTPURLResponse)?.statusCode))")
            }
        }.resume()
    }
}


struct MonitoringDataCard: View {
    let monitoringData: MonitoringData
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(monitoringData.parameter.parameterName)
                .font(.system(size: 24, weight: .bold))
            
            Text("\(String(format: "%.2f", monitoringData.value)) \(monitoringData.parameter.unit)")
                .font(.subheadline)
            
            Text("Update Time: \(formatDate(monitoringData.updateTime))")
                .font(.subheadline)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(cardColor(for: monitoringData))
        .cornerRadius(20)
        .shadow(radius: 8)
    }
    
    private func cardColor(for monitoringData: MonitoringData) -> Color {
            if monitoringData.parameter.maxValue < monitoringData.value {
                return Color.red.opacity(0.5)
            } else {
                return Color.gradientRight
            }
        }
        
        private func formatDate(_ dateString: String) -> String {
            let formatter = DateFormatter()
            formatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSSSSZ"
            if let date = formatter.date(from: dateString) {
                formatter.dateStyle = .medium
                formatter.timeStyle = .short
                return formatter.string(from: date)
            }
            return dateString
        }
    }
