import SwiftUI

struct UserDashboardView: View {
    @StateObject private var viewModel: UserDashboardViewModel
    @StateObject private var notificationViewModel: NotificationViewModel
    @State private var selectedTab = 1
    @State private var selectedLocation: Int? = nil
    @State private var showLocationInfo = false
    @State private var showNotifications = false
    
    @State private var accessToken: String
    
    init(accessToken: String) {
        _viewModel = StateObject(wrappedValue: UserDashboardViewModel(accessToken: accessToken))
        _notificationViewModel = StateObject(wrappedValue: NotificationViewModel(accessToken: accessToken))  
        self.accessToken = accessToken
    }
    
    var body: some View {
        NavigationView {
            
            TabView(selection: $selectedTab) {
                dashboardView
                    .tabItem {
                        Image(systemName: selectedTab == 1 ? "house.fill" : "house")
                        Text("Dashboard")
                    }
                    .tag(1)
                
                AddLocationView(accessToken: accessToken)
                    .tabItem {
                        Image(systemName: "plus.circle.fill")
                            .resizable()
                            .frame(width: 100, height: 50)
                            .offset(y: -20)
                        Text("Add new location")
                    }
                    .tag(2)
                
                SettingView(accessToken: $accessToken, user: viewModel.user, selectedTab: $selectedTab)
                    .tabItem {
                        Image(systemName: selectedTab == 3 ? "gearshape.fill" : "gearshape")
                        Text("Settings")
                    }
                    .tag(3)
            }
            .sheet(isPresented: $showLocationInfo) {
                if let selLocationId = selectedLocation {
                    LocationInfoView(locId: selLocationId, accessToken: accessToken) {
                        viewModel.fetchUserLocations()
                    }
                }
            }
        }.navigationBarBackButtonHidden(true)
    }
    
    var dashboardView: some View {
        VStack(alignment: .leading) {
            HStack {
                if let user = viewModel.user {
                    Text("Hello, \(user.firstName) 👋")
                        .font(.title)
                        .padding()
                        .foregroundColor(.primary)
                        .bold()
                }
                Spacer()
                Button {
                    viewModel.fetchUserLocations()
                } label: {
                    Image(systemName: "arrow.clockwise.circle")
                        .resizable()
                        .frame(width: 24, height: 24)
                        .padding()
                        .foregroundColor(.main)
                }

                Button(action: {
                    showNotifications = true
                }) {
                    ZStack {
                        Image(systemName: "bell")
                            .resizable()
                            .frame(width: 24, height: 24)
                            .padding()
                            .foregroundColor(.main)
                        if notificationViewModel.hasNotifications {
                            Circle()
                                .fill(Color.red)
                                .frame(width: 10, height: 10)
                                .offset(x: 12, y: -10)
                        }
                    }
                }
                .sheet(isPresented: $showNotifications) {
                    NotificationView(viewModel: NotificationViewModel(accessToken: accessToken))
                }
                
            }
            
        
            ScrollView {
                VStack(spacing: 20) {
                    ForEach(viewModel.locations) { location in
                        VStack(alignment: .leading, spacing: 12) {
                            Text(location.name)
                                .font(.title2)
                                .bold()
                                .foregroundColor(.white)
                                .padding(.leading, 16)
                            
                            Text(location.description)
                                .font(.body)
                                .foregroundColor(.white.opacity(0.8))
                                .padding(.leading, 16)
                            
                            Text("Location: \(location.city), \(location.country)")
                                .font(.callout)
                                .foregroundColor(.white.opacity(0.6))
                                .padding(.leading, 16)
                        }
                        .padding(16)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(LinearGradient(
                            gradient: Gradient(colors: [Color.green.opacity(0.7), Color.green]),
                            startPoint: .topLeading,
                            endPoint: .bottomTrailing
                        ))
                        .cornerRadius(20)
                        .shadow(radius: 8)
                        .onTapGesture {
                            selectedLocation = location.id
                            showLocationInfo = true
                        }
                    }
                }
                .padding()
            }
        }
        .padding()
        .onAppear {
            viewModel.fetchCurrentUser()
            viewModel.fetchUserLocations()
        }.navigationBarBackButtonHidden(true)
    }
    
}
