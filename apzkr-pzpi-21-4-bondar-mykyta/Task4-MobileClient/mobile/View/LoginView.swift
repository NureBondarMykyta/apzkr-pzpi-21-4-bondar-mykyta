import SwiftUI


enum FocusFields {
    case username
    case password
}

struct LoginView: View {
    
    @StateObject private var viewModel = LoginViewModel()
    @FocusState private var focusField: FocusFields?
    @State private var navigateToDashboard = false
    
    var body: some View {
        NavigationStack {
            VStack {
                Text("Login here")
                    .font(.system(size: 30, weight: .bold))
                    .foregroundColor(.main)
                    .padding(.bottom)
                
                Text("Welcome back you've\nbeen missed!")
                    .font(.system(size: 16, weight: .semibold))
                    .multilineTextAlignment(.center)
                    .padding(.bottom, 70)
                
                CustomTextField(name: $viewModel.username, textField: "Username")
                    .focused($focusField, equals: .username)
                    .onSubmit {
                        focusField = .password
                    }
                
                PasswordField(password: $viewModel.password, textField: "Password")
                    .focused($focusField, equals: .password)
                    .onSubmit {
                        viewModel.login()
                    }
                
                if let errorMessage = viewModel.errorMessage {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .padding()
                }
                
                Button {
                    viewModel.login()
                } label: {
                    Text("Sign in")
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(.white)
                }
                .padding(.vertical)
                .frame(maxWidth: .infinity)
                .background(.main)
                .cornerRadius(15)
                .padding()
                
                NavigationLink(destination: UserDashboardView(accessToken: viewModel.accessToken ?? ""), isActive: $navigateToDashboard) {
                    EmptyView()
                }.navigationBarBackButtonHidden(true)
                
                
                NavigationLink(destination: RegistrationView()) {
                    Text("Don't have an account yet?")
                        .font(.system(size: 18, weight: .regular))
                        .foregroundColor(.black)
                }
                .frame(maxWidth: .infinity)
                .cornerRadius(15)
                .padding(.horizontal)
                .navigationBarBackButtonHidden(true)
            }
            .navigationBarBackButtonHidden(true)
            .padding()
            .onChange(of: viewModel.isAuthenticated) { newValue in
                if newValue {
                    navigateToDashboard = true
                }
            }
        }
    }
}
