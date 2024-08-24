import SwiftUI

struct RegistrationSuccessView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        VStack(spacing: 20) {
            Text("Registration Successful!")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding()

            Text("Thank you for registering. You can now log in with your credentials.")
                .font(.body)
                .multilineTextAlignment(.center)
                .padding()

            Button(action: {
                // Закрываем все окна в навигационном стеке и возвращаемся на экран логина
                dismiss()
            }) {
                Text("Go to Login")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(5)
            }
            .padding(.top, 20)
        }
        .padding()
    }
}

struct RegistrationSuccessView_Previews: PreviewProvider {
    static var previews: some View {
        RegistrationSuccessView()
    }
}
