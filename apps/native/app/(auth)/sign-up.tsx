import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startOAuthFlow: googleOAuth } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: githubOAuth } = useOAuth({ strategy: "oauth_github" });
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace("/(app)/dashboard");
    } catch (err: any) {
      console.error("Error:", JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const onGoogleSignUp = async () => {
    try {
      const { createdSessionId, setActive } = await googleOAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(app)/dashboard");
      }
    } catch (err: any) {
      console.error("OAuth error:", err);
      setError("Failed to sign up with Google");
    }
  };

  const onGithubSignUp = async () => {
    try {
      const { createdSessionId, setActive } = await githubOAuth();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(app)/dashboard");
      }
    } catch (err: any) {
      console.error("OAuth error:", err);
      setError("Failed to sign up with GitHub");
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
            <Text className="mt-4 font-bold text-3xl text-gray-900">
              {pendingVerification ? "Verify Email" : "Create Account"}
            </Text>
            <Text className="mt-2 text-center text-gray-600">
              {pendingVerification
                ? "Enter the verification code sent to your email"
                : "Sign up to get started with UpCraft Crew"}
            </Text>
          </View>

          {/* Form */}
          <View className="flex-1 space-y-6">
            {error ? (
              <View className="rounded-lg bg-red-50 p-4">
                <Text className="text-center text-red-600 text-sm">{error}</Text>
              </View>
            ) : null}

            {!pendingVerification ? (
              <>
                {/* Social Login Buttons */}
                <View className="space-y-3">
                  <TouchableOpacity
                    onPress={onGoogleSignUp}
                    className="h-12 flex-row items-center justify-center rounded-lg border-2 border-gray-200 bg-white"
                  >
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text className="ml-2 font-medium text-gray-700">Continue with Google</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onGithubSignUp}
                    className="h-12 flex-row items-center justify-center rounded-lg border-2 border-gray-200 bg-white"
                  >
                    <Ionicons name="logo-github" size={20} color="#333" />
                    <Text className="ml-2 font-medium text-gray-700">Continue with GitHub</Text>
                  </TouchableOpacity>
                </View>

                {/* Divider */}
                <View className="flex-row items-center">
                  <View className="h-px flex-1 bg-gray-200" />
                  <Text className="mx-4 text-gray-500 text-sm">or continue with email</Text>
                  <View className="h-px flex-1 bg-gray-200" />
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-1 space-y-2">
                    <Text className="text-gray-700 text-sm font-medium">First Name</Text>
                    <TextInput
                      autoCapitalize="words"
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="John"
                      placeholderTextColor="#9CA3AF"
                      className="h-12 rounded-lg border border-gray-200 bg-white px-4 text-gray-900"
                    />
                  </View>

                  <View className="flex-1 space-y-2">
                    <Text className="text-gray-700 text-sm font-medium">Last Name</Text>
                    <TextInput
                      autoCapitalize="words"
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Doe"
                      placeholderTextColor="#9CA3AF"
                      className="h-12 rounded-lg border border-gray-200 bg-white px-4 text-gray-900"
                    />
                  </View>
                </View>

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
                  <Text className="text-gray-500 text-xs">
                    Password must be at least 8 characters
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={onSignUpPress}
                  disabled={loading || !emailAddress || !password || !firstName || !lastName}
                  className={`h-12 items-center justify-center rounded-full ${
                    loading || !emailAddress || !password || !firstName || !lastName
                      ? "bg-gray-300"
                      : "bg-orange-500"
                  }`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="font-semibold text-white">Sign up</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View className="space-y-2">
                  <Text className="text-gray-700 text-sm font-medium">Verification Code</Text>
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="Enter code"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    className="h-12 rounded-lg border border-gray-200 bg-white px-4 text-center text-gray-900 text-xl tracking-widest"
                  />
                </View>

                <TouchableOpacity
                  onPress={onPressVerify}
                  disabled={loading || !code}
                  className={`h-12 items-center justify-center rounded-full ${
                    loading || !code ? "bg-gray-300" : "bg-orange-500"
                  }`}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="font-semibold text-white">Verify Email</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            <View className="flex-row items-center justify-center">
              <Text className="text-center text-gray-600 text-sm">Already have an account? </Text>
              <Link href="/sign-in">
                <TouchableOpacity>
                  <Text className="font-semibold text-orange-500 text-sm">Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
