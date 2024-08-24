import SwiftUI

enum AlertType: Identifiable {
    case message(String)
    case logoutConfirmation
    
    var id: String {
        switch self {
        case .message(let message):
            return "message-\(message)"
        case .logoutConfirmation:
            return "logoutConfirmation"
        }
    }
}
struct SettingView: View {
    @Binding var accessToken: String
    let user: User?
    @Binding var selectedTab: Int
    
    @State private var currentAlert: AlertType?
    @State private var email: String = ""
    @State private var userNmae: String = ""
    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @State private var password: String = ""
    @State private var confirmPass: String = ""
    @State private var showAlert = false
    @State private var alertMessage: String = ""
    @State private var userId: Int?
    @State private var isLoggedOut = false
    @State private var showLogoutConfirmation = false
    
    
    var body: some View {
        NavigationStack{
            if let user = user {
                VStack(spacing: 20) {
                    
                    Text("👤 \(user.firstName) \(user.lastName)")
                        .font(.largeTitle)
                        .foregroundColor(.main)
                        .bold()
                    
                    Text("@\(user.username)")
                        .font(.system(size: 20))
                        .foregroundColor(.gray)
                    
                    Group {
                        CustomTextFieldUser(placeholder: "Name", text: $firstName)
                        CustomTextFieldUser(placeholder: "Surname", text: $lastName)
                        CustomTextFieldUser(placeholder: "Username", text: $userNmae)
                        CustomTextFieldUser(placeholder: "Email", text: $email, keyboardType: .emailAddress)
                        CustomSecureField(placeholder: "Password", text: $password)
                        CustomSecureField(placeholder: "Confirm Password", text: $confirmPass)
                    }
                    
                    Spacer()
                    
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
                    
                    Button(action: {
                        currentAlert = .logoutConfirmation
                    }) {
                        Text("Logout")
                            .foregroundColor(.red)
                    }
                    
                    NavigationLink(destination: WelcomeView(), isActive: $isLoggedOut) {
                        EmptyView()
                    }
                }
                .padding()
                .onAppear {
                    email = user.email
                    userNmae = user.username
                    firstName = user.firstName
                    lastName = user.lastName
                    userId = user.id
                }.alert(item: $currentAlert) { alertType in
                    switch alertType {
                    case .message(let message):
                        return Alert(
                            title: Text("Message"),
                            message: Text(message),
                            dismissButton: .default(Text("OK"))
                        )
                    case .logoutConfirmation:
                        return Alert(
                            title: Text("Are you sure?"),
                            message: Text("Do you really want to log out?"),
                            primaryButton: .destructive(Text("Log out")) {
                                logout()
                            },
                            secondaryButton: .cancel()
                        )
                    }
                }
            }
            else {
                Text("No user available")
                    .font(.headline)
                    .foregroundColor(.secondary)
                    .padding()
            }
        }
    }
    
    func saveChanges() {
        guard let url = URL(string: "http://127.0.0.1:8000/api/v1/users/\(userId!)/") else { return }
        let body: [String: Any]
        if password != "" {
            if password == confirmPass {
                body = [
                    "first_name": firstName,
                    "last_name": lastName,
                    "email": email,
                    "username": userNmae,
                    "password": password
                ]
            } else {
                self.currentAlert = .message("Passwords don't match")
                return
            }
        } else {
            body = [
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "username": userNmae,
            ]
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.httpBody = try? JSONSerialization.data(withJSONObject: body)
        request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                DispatchQueue.main.async {
                    self.currentAlert = .message("Error when getting location types: \(error?.localizedDescription)")
                }
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 {
                DispatchQueue.main.async {
                    self.currentAlert = .message("The user's data has been successfully changed")
                    self.selectedTab = 1
                }
            } else {
                let responseString = String(data: data, encoding: .utf8) ?? "Unknown error"
                DispatchQueue.main.async {
                    self.currentAlert = .message("Such a user exists or the mail was entered incorrectly")
                }
            }
        }.resume()
        
    }
    func logout() {
        self.isLoggedOut = true
        self.accessToken = ""
    }
}
 
struct CustomTextFieldUser: View {
    let placeholder: String
    @Binding var text: String
    var keyboardType: UIKeyboardType = .default
    
    var body: some View {
        TextField(placeholder, text: $text)
            .padding()
            .background(Color(.secondaryGreen))
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.gray.opacity(0.5), lineWidth: 1)
            )
            .keyboardType(keyboardType)
    }
}

  
struct CustomSecureField: View {
    let placeholder: String
    @Binding var text: String
    
    var body: some View {
        SecureField(placeholder, text: $text)
            .padding()
            .background(Color(.secondaryGreen))
            .cornerRadius(10)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(Color.gray.opacity(0.5), lineWidth: 1)
            )
    }
}


