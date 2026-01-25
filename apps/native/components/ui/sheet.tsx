import * as React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  type ViewProps,
  type TextProps,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={() => onOpenChange?.(false)}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={() => onOpenChange?.(false)}>
          <View className="flex-1 justify-end bg-black/50">
            <TouchableWithoutFeedback>
              <View className="max-h-[90%]">{children}</View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

interface SheetContentProps extends ViewProps {
  className?: string;
}

function SheetContent({ className, children, ...props }: SheetContentProps) {
  return (
    <View className={cn("rounded-t-3xl bg-card", className)} {...props}>
      {/* Handle bar */}
      <View className="items-center py-3">
        <View className="h-1 w-10 rounded-full bg-muted-foreground/30" />
      </View>
      <ScrollView
        className="max-h-[80vh]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

interface SheetHeaderProps extends ViewProps {
  className?: string;
  onClose?: () => void;
}

function SheetHeader({ className, onClose, children, ...props }: SheetHeaderProps) {
  return (
    <View className={cn("flex-row items-center justify-between px-6 pb-4", className)} {...props}>
      <View className="flex-1">{children}</View>
      {onClose && (
        <TouchableOpacity onPress={onClose} className="p-1">
          <Ionicons name="close" size={24} color="#737373" />
        </TouchableOpacity>
      )}
    </View>
  );
}

interface SheetTitleProps extends TextProps {
  className?: string;
}

function SheetTitle({ className, ...props }: SheetTitleProps) {
  return <Text className={cn("text-xl font-bold text-foreground", className)} {...props} />;
}

interface SheetDescriptionProps extends TextProps {
  className?: string;
}

function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return <Text className={cn("text-sm text-muted-foreground mt-1", className)} {...props} />;
}

interface SheetBodyProps extends ViewProps {
  className?: string;
}

function SheetBody({ className, ...props }: SheetBodyProps) {
  return <View className={cn("px-6", className)} {...props} />;
}

interface SheetFooterProps extends ViewProps {
  className?: string;
}

function SheetFooter({ className, ...props }: SheetFooterProps) {
  return <View className={cn("flex-row gap-3 px-6 pt-4", className)} {...props} />;
}

export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  type SheetProps,
};
