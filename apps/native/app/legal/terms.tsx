import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function TermsOfService() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Terms of Service</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 p-6">
        <Text className="text-sm text-gray-600 mb-4">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">1. Acceptance of Terms</Text>
        <Text className="text-sm text-gray-600 mb-4">
          By accessing and using Upcraft Crew, you accept and agree to be bound by the terms and
          provision of this agreement.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">2. Use License</Text>
        <Text className="text-sm text-gray-600 mb-4">
          Permission is granted to temporarily use Upcraft Crew for personal or commercial
          construction project management purposes. This is the grant of a license, not a transfer
          of title.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">3. User Account</Text>
        <Text className="text-sm text-gray-600 mb-4">
          You are responsible for maintaining the confidentiality of your account and password. You
          agree to accept responsibility for all activities that occur under your account.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">4. Service Availability</Text>
        <Text className="text-sm text-gray-600 mb-4">
          We strive to provide continuous service availability but do not guarantee uninterrupted
          access. We reserve the right to modify or discontinue the service at any time.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">5. Intellectual Property</Text>
        <Text className="text-sm text-gray-600 mb-4">
          All content, features, and functionality of Upcraft Crew are owned by us and are protected
          by international copyright, trademark, and other intellectual property laws.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">
          6. Limitation of Liability
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          Upcraft Crew shall not be liable for any indirect, incidental, special, consequential, or
          punitive damages resulting from your use or inability to use the service.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">7. Changes to Terms</Text>
        <Text className="text-sm text-gray-600 mb-4">
          We reserve the right to modify these terms at any time. Continued use of the service after
          changes constitutes acceptance of the new terms.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">8. Contact Information</Text>
        <Text className="text-sm text-gray-600 mb-6">
          For questions about these Terms of Service, please contact us through the app support
          section.
        </Text>
      </ScrollView>
    </View>
  );
}
