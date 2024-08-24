import SwiftUI
import Stripe

struct CheckoutView: View {
    let accessToken: String
    @State private var paymentMethodParams: STPPaymentMethodParams?
    @State private var message: String = ""
    @State private var showRegisterLocationView: Bool = false
    let paymentGatewayController = PaymentGatewayController()
    
    private func pay() {
        guard let clientSecret = PaymentConfig.shared.paymentIntentClientSecret else {
            return
        }
        let paymentIntentParams = STPPaymentIntentParams(clientSecret: clientSecret)
        paymentIntentParams.paymentMethodParams = paymentMethodParams
        
        paymentGatewayController.submitPayment(intent: paymentIntentParams) { status, intent, error in
            switch status {
            case .failed:
                message = "Payment failed. Please try again."
            case .canceled:
                message = "Payment was canceled."
            case .succeeded:
                message = "Payment succeeded!"
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                    showRegisterLocationView = true
                }
            }
        }
    }
    
    var body: some View {
        VStack(spacing: 20) {

            Text("Checkout")
                .font(.largeTitle)
                .fontWeight(.bold)
                .padding(.top)
                .foregroundColor(.main)
            
            Image("pay2")
                .resizable()
                .scaledToFit()
                .padding(.vertical, 30)

            Text("Total: $5.00")
                .font(.headline)
                .foregroundColor(.gray)
 
            Section {
                STPPaymentCardTextField.Representable.init(paymentMethodParams: $paymentMethodParams)
                    .padding()
                    .background(Color(.secondarySystemBackground))
                    .cornerRadius(10)
                    .padding(.horizontal)
            }

            Button(action: {
                pay()
            }) {
                Text("Pay Now")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding()
                    .frame(maxWidth: .infinity)
                    .background(Color.main)
                    .cornerRadius(10)
                    .padding(.horizontal)
            }
            .padding(.top)

            Text(message)
                .font(.body)
                .foregroundColor(message.contains("succeeded") ? .green : .red)
                .padding(.top)
            
            Spacer()
        }
        .padding()
        .background(Color(.systemGroupedBackground).edgesIgnoringSafeArea(.all))
        .fullScreenCover(isPresented: $showRegisterLocationView) {
            RegisterLocationView(accessToken: accessToken)
        }
    }
}

#Preview {
    CheckoutView(accessToken: "token")
}
