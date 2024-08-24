//
//  mobileApp.swift
//  mobile
//
//  Created by Никита Бондарь on 14.08.2024.
//

import SwiftUI
import Stripe

@main
struct mobileApp: App {

    init(){
        StripeAPI.defaultPublishableKey = "pk_test_51PFxnOE564nS53N6l4aGyiJUvMRojq4PjFCR4QzXaVHzHSD63HQKjqwOflg2YP8Qjmu834LE73XbP9Drur7oR5BN008OMDloL0"
    }
    
    var body: some Scene {
        WindowGroup {
            WelcomeView()
        }
    }
}
