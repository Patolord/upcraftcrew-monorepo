import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SignInPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
      router.replace("/(app)/dashboard");
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-gray-50"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-16 pb-8">
          {/* Logo */}
          <View className="items-center mb-8">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-orange-500">
              <Text className="font-bold text-3xl text-white">UC</Text>
            </View>
            <Text className="mt-4 font-bold text-3xl text-gray-900">Welcome Back</Text>
            <Text className="mt-2 text-center text-gray-600">
              Sign in to continue to UpCraft Crew
            </Text>
          </View>

          {/* Form */}
          <View className="flex-1 space-y-6">
            {error ? (
              <View className="rounded-lg bg-red-50 p-4">
                <Text className="text-center text-red-600 text-sm">{error}</Text>
              </View>
            ) : null}

            <View className="space-y-2">
              <Text className="text-gray-700 text-sm font-medium">Email</Text>
              <View className="relative">
                <TextInput
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  className="h-12 rounded-lg border border-gray-200 bg-white px-4 pr-12 text-gray-900"
                />
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#9CA3AF"
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                  }}
                />
              </View>
            </View>

            <View className="space-y-2">
              <Text className="text-gray-700 text-sm font-medium">Password</Text>
              <View className="relative">
                <TextInput
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="********"
                  placeholderTextColor="#9CA3AF"
                  className="h-12 rounded-lg border border-gray-200 bg-white px-4 pr-12 text-gray-900"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                  }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="items-end">
              <Text className="text-orange-500 text-sm">Forgot password?</Text>
            </View>

            <TouchableOpacity
              onPress={onSignInPress}
              disabled={loading || !emailAddress || !password}
              className={`h-12 items-center justify-center rounded-full ${
                loading || !emailAddress || !password ? "bg-gray-300" : "bg-orange-500"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="font-semibold text-white">Log in</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center justify-center">
              <Text className="text-center text-gray-600 text-sm">Don't have an account? </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text className="font-semibold text-orange-500 text-sm">Sign up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
