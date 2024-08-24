 
import SwiftUI

struct PasswordField: View {
    @Binding var password: String
    var textField: String
    @FocusState var focusField: FocusFields?
    var body: some View {
        VStack{
            SecureField(textField , text: $password)
                .focused($focusField, equals: .password)
                .padding()
                .background(.secondaryGreen)
                .cornerRadius(15)
                .background(
                    RoundedRectangle(cornerRadius: 15)
                        .stroke(focusField == .password ? Color(.main) : .white, lineWidth: 2)
                )
                .padding(.horizontal)
                
        }
    }
}

