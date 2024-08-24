import SwiftUI


enum ViewStack{
    case login
    case registration
}

struct  WelcomeView: View {
    @State private var presentNextView = false
    @State private var nextView: ViewStack = .login
    var body: some View {
        NavigationStack{
            VStack{
                Image("earth")
                    .resizable()
                    .scaledToFit()
                    .padding(.vertical, 30)
                
                
                
                Text("Environmental Control — Caring for Tomorrow.")
                    .font(.system(size: 30, weight: .bold))
                    .multilineTextAlignment(.center)
                    .foregroundColor(Color("mainColor"))
                
                Spacer()
                
                HStack(spacing: 20){
                    Button{
                        nextView = .login
                        presentNextView.toggle()
                    } label: {
                        Text("Login")
                            .font(.system(size: 20, weight: .semibold))
                            .foregroundColor(.white)
                    }.frame(width: 160, height: 60)
                        .background(Color("mainColor"))
                        .cornerRadius(10)
                    
                    Button{
                        nextView = .registration
                        presentNextView.toggle()
                    } label: {
                        Text("Register")
                            .font(.system(size: 20, weight: .semibold))
                            .foregroundColor(.black)
                    }.frame(width: 160, height: 60)
                        .cornerRadius(10)
                }
            }
            .padding()
            .navigationDestination(isPresented: $presentNextView){
                switch nextView {
                case .login:
                    LoginView()
                case .registration:
                    RegistrationView()
                }
            }
        }.navigationBarBackButtonHidden(true)
    }
}

struct WelcomeView_Previews: PreviewProvider {
    static var previews: some View {
        WelcomeView()
        
    }
}
