

import Foundation

class PaymentConfig{
    var paymentIntentClientSecret : String?
    static var shared: PaymentConfig = PaymentConfig()
    
    private init(){}
    
}
