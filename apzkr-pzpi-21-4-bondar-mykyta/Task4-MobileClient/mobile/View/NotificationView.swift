import SwiftUI

struct NotificationView: View {
    @ObservedObject var viewModel: NotificationViewModel
    
    var body: some View {
        NavigationView {
            VStack {
                if viewModel.isLoading {
                    ProgressView("Loading...")
                        .padding()
                } else if let errorMessage = viewModel.errorMessage {
                    Text("Error: \(errorMessage)")
                        .foregroundColor(.red)
                        .padding()
                } else if viewModel.notifications.isEmpty {
                    Text("There are no notifications")
                        .padding()
                } else {
                    ScrollView {
                        VStack(spacing: 16) {
                            ForEach(viewModel.notifications) { notification in
                                HStack(alignment: .center, spacing: 10) {
                                    
                                    Image(systemName: "envelope")
                                        .foregroundColor(.blue)
                                        .font(.system(size: 20))
                                    
                                    Divider()
                                    
                                    VStack(alignment: .leading, spacing: 8) {
                                        
                                        Text(notification.content)
                                            .font(.headline)
                                            .foregroundColor(.primary)
                                            .multilineTextAlignment(.leading)
                                        
                                        
                                        Text(viewModel.formattedDate(for: notification.createdDate))
                                            .font(.subheadline)
                                            .foregroundColor(.gray)
                                    }
                                    
                                    Spacer()
                                    
                                    Button(action: {
                                        viewModel.deleteNotification(notification.id)
                                    }) {
                                        Image(systemName: "trash")
                                            .foregroundColor(.red)
                                    }
                                    .padding(.trailing, 10)
                                }
                                .padding()
                                .background(Color(UIColor.secondarySystemBackground))
                                .cornerRadius(12)
                                .shadow(radius: 4)
                                .padding(.horizontal, 16)
                            }
                        }
                        .padding(.top, 16)
                    }
                }
            }
            .navigationTitle("Notifications")
            .navigationBarItems(trailing: Button(action: {
                viewModel.fetchNotifications()
            }) {
                Image(systemName: "arrow.clockwise")
            })
        }
    }
}

extension NotificationViewModel {
    func formattedDate(for dateString: String) -> String {
        let inputFormatter = DateFormatter()
        inputFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSSSSZ"
        inputFormatter.locale = Locale(identifier: "en_US_POSIX")
        
        if let date = inputFormatter.date(from: dateString) {
            let outputFormatter = DateFormatter()
            outputFormatter.dateFormat = "dd.MM 'at' HH:mm"
            return outputFormatter.string(from: date)
        } else {
            return dateString
        }
    }
    
    
    func deleteNotification(_ id: Int) {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/location-notifications/\(id)/") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                DispatchQueue.main.async {
                    self.errorMessage = "Failed to delete notification: \(error.localizedDescription)"
                }
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 204 {
                
                DispatchQueue.main.async {
                    self.fetchNotifications()
                }
            } else {
                DispatchQueue.main.async {
                    self.errorMessage = "Failed to delete notification."
                }
            }
        }.resume()
    }
}
