import SwiftUI

struct RegistrationView: View {
    @Environment(\.dismiss) var dismiss
    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @State private var username: String = ""
    @State private var email: String = ""
    @State private var password: String = ""
    @State private var gender: String = "M"
    @State private var birthDate = Date()
    @State private var confirmPassword = ""
    @State private var registrationSuccess = false
        @State private var registrationFailed = false
        @State private var errorMessage = ""

    @FocusState private var focusField: FocusFields?
    
    var body: some View{
        NavigationStack{
            VStack{
                Text("Create account")
                    .font(.system(size: 30, weight: .bold))
                    .foregroundColor(.main)
                    .padding(.bottom)
                
                CustomTextField(name: $firstName, textField: "First name")
                CustomTextField(name: $lastName, textField: "Last name")
                CustomTextField(name: $username, textField: "Username")
                CustomTextField(name: $email, textField: "Email")
                PasswordField(password: $password, textField: "Password")
                PasswordField(password: $confirmPassword, textField: "Confirm Password")
                Picker("Gender", selection: $gender) {
                                Text("Male").tag("M")
                                Text("Female").tag("F")
                            }
                            .pickerStyle(SegmentedPickerStyle())
                            .padding()

                DatePicker("Birth Date", selection: $birthDate, displayedComponents: .date)
                                .datePickerStyle(CompactDatePickerStyle())
                                .padding()
                
                    
                
                Button {
                    register()
                } label: {
                    Text("Sign up")
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(.white)
                }
                .padding(.vertical)
                .frame(maxWidth: /*@START_MENU_TOKEN@*/.infinity/*@END_MENU_TOKEN@*/)
                .background(.main)
                .cornerRadius(15)
                .padding()
                .alert(isPresented: $registrationFailed) {
                                Alert(title: Text("Registration Failed"), message: Text(errorMessage), dismissButton: .default(Text("OK")))
                            }
                
                NavigationLink(destination: LoginView()) {
                                Text("Already have an account?")
                                    .font(.system(size: 18, weight: .regular))
                                    .foregroundColor(.black)
                            }
                            .frame(maxWidth: .infinity)
                            .cornerRadius(15)
                            .padding(.horizontal)
                            .navigationBarBackButtonHidden(true)
                        
                
            }
        }.alert("Your account has been successfully created! 🥳", isPresented: $registrationSuccess){
            Button("Ok"){
                dismiss()
            }
        }
    }
    
    func register() {
        if password == confirmPassword {
            guard let url = URL(string: "http://127.0.0.1:8000/api/v1/users/") else { return }
            
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd"
            let birthDateString = dateFormatter.string(from: birthDate)
            
            let body: [String: Any] = [
                "first_name": firstName,
                "last_name": lastName,
                "username": username,
                "email": email,
                "password": password,
                "gender": gender,
                "birth_date": birthDateString
            ]
            
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.httpBody = try? JSONSerialization.data(withJSONObject: body)
            request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            
            URLSession.shared.dataTask(with: request) { data, response, error in
                guard let data = data, error == nil else {
                    DispatchQueue.main.async {
                        self.errorMessage = error?.localizedDescription ?? "Unknown error"
                        self.registrationFailed = true
                    }
                    return
                }
                
                if let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 201 {
                    DispatchQueue.main.async {
                        self.registrationSuccess = true
                    }
                } else {
                    let responseString = String(data: data, encoding: .utf8) ?? "Unknown error"
                    DispatchQueue.main.async {
                        self.errorMessage = responseString
                        self.registrationFailed = true
                    }
                }
            }.resume()
        } else {
            self.errorMessage = "Password not match"
            self.registrationFailed = true
        }
        }
}

struct RegistrationView_Previews: PreviewProvider {
    static var previews: some View {
        RegistrationView()
    }
}
