import SwiftUI

struct AddLocationView: View {
    let accessToken: String
    
    @State private var isActive : Bool = false
    
    private func startCheckout(completion: @escaping (String?) -> Void){
        let url = URL(string: "https://stone-checkered-fly.glitch.me/create-payment-intent")!
        var request = URLRequest(url: url)
                request.httpMethod = "POST"
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        print(request)
        URLSession.shared.dataTask(with: request){data, response, error in
            guard let data = data, error == nil,
                  (response as? HTTPURLResponse)?.statusCode == 200
            else{
                completion(nil)
                return
            }
            let checkoutIntentResponse = try? JSONDecoder().decode(CheckoutIntentResponse.self, from: data)
            completion(checkoutIntentResponse?.clientSecret)
        }.resume()
    }
    var body: some View {
        VStack {
            Text("Add Location")
                .font(.title)
                .padding()
                .bold()
                .foregroundColor(.main)
            Image("pay")
                .resizable()
                .scaledToFit()
                .padding(.vertical, 30)
            Text("To add a location, you need to make a payment in the form of $ 5, after which you can fill out information about the location.")
                .font(.system(size: 18, weight: .regular))
                .multilineTextAlignment(.center)
                .foregroundColor(.main)
                .padding()
            Spacer()
            
            NavigationLink(isActive: $isActive){
                CheckoutView(accessToken: accessToken)
            } label: {
                Button {
                    startCheckout{ clientSecret in
                        PaymentConfig.shared.paymentIntentClientSecret = clientSecret
                        DispatchQueue.main.async{
                            isActive = true
                        }
                        isActive = true
                    }
                } label: {
                    Text("Pay")
                        .font(.system(size: 20, weight: .semibold))
                        .foregroundColor(.white)
                }
            }
            
            .padding(.vertical)
            .frame(maxWidth: .infinity)
            .background(.main)
            .cornerRadius(15)
            .padding(.horizontal)
            .padding(.bottom, 30)

        }
    }
}

#Preview {
    AddLocationView(accessToken: "accessToken")
}
