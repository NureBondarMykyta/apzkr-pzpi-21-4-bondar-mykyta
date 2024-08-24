 

import SwiftUI

struct CustomTextField: View {
    @Binding var name : String
    @FocusState var focusField: FocusFields?
    var textField: String
    var body: some View {
        VStack{
            TextField(textField, text: $name)
                .focused($focusField, equals: .username)
                .padding()
                .background(.secondaryGreen)
                .cornerRadius(15)
                .background(
                    RoundedRectangle(cornerRadius: 15)
                        .stroke(focusField == .username ? Color(.main) : .white, lineWidth: 2)
                )
                .padding(.horizontal)
                .padding(.bottom, 10)
            
        }
    }
}

