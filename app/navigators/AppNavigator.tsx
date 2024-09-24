import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React from "react"
import { useColorScheme } from "react-native"
import UserListScreen from "../screens/UserListScreen"
import UserPostsScreen from "../screens/UserPostsScreen"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"

// Define the parameter list for the app's navigation stack
export type AppStackParamList = {
  UserList: undefined
  UserPosts: { userId: number }
}

// Define the exit routes for Android back button behavior
const exitRoutes = ["UserList"]

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Create the native stack navigator
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, navigationBarColor: colors.background }}
    >
      <Stack.Screen name="UserList" component={UserListScreen} />
      <Stack.Screen name="UserPosts" component={UserPostsScreen} />
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
