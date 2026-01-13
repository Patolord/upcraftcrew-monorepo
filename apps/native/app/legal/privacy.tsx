import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Privacy Policy</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1 p-6">
        <Text className="text-sm text-gray-600 mb-4">
          Last updated: {new Date().toLocaleDateString("en-US")}
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">
          1. Information We Collect
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          We collect information you provide directly to us, including name, email address, and
          project-related data. We also collect usage information and device data to improve our
          services.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">
          2. How We Use Your Information
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          Your information is used to provide and maintain our services, improve user experience,
          communicate with you about updates, and ensure platform security.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">3. Data Security</Text>
        <Text className="text-sm text-gray-600 mb-4">
          We implement appropriate technical and organizational measures to protect your personal
          information. However, no method of transmission over the internet is 100% secure.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">4. Data Sharing</Text>
        <Text className="text-sm text-gray-600 mb-4">
          We do not sell your personal information. We may share data with service providers who
          assist in operating our platform, subject to confidentiality agreements.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">5. Your Rights</Text>
        <Text className="text-sm text-gray-600 mb-4">
          You have the right to access, correct, or delete your personal information. You may also
          request data portability or object to certain data processing activities.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">6. Cookies and Tracking</Text>
        <Text className="text-sm text-gray-600 mb-4">
          We use cookies and similar tracking technologies to track activity and store certain
          information to improve your experience and analyze usage patterns.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">7. Data Retention</Text>
        <Text className="text-sm text-gray-600 mb-4">
          We retain your information for as long as necessary to provide our services and comply
          with legal obligations. You may request deletion of your account at any time.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">
          8. Changes to Privacy Policy
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          We may update this Privacy Policy periodically. We will notify you of any material changes
          through the app or via email.
        </Text>

        <Text className="text-base font-semibold text-gray-800 mb-2">9. Contact Us</Text>
        <Text className="text-sm text-gray-600 mb-6">
          If you have questions about this Privacy Policy, please contact us through the app support
          section.
        </Text>
      </ScrollView>
    </View>
  );
}
