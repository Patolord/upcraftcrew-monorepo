import * as React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  type ModalProps,
  type ViewProps,
  type TextProps,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface DialogProps extends Omit<ModalProps, "visible"> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

function Dialog({ open = false, onOpenChange, children, ...props }: DialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => onOpenChange?.(false)}
      statusBarTranslucent
      {...props}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={() => onOpenChange?.(false)}>
          <View className="flex-1 items-center justify-center bg-black/50 px-4">
            <TouchableWithoutFeedback>
              <View className="w-full max-w-md">{children}</View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

interface DialogContentProps extends ViewProps {
  className?: string;
}

function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <View className={cn("rounded-2xl bg-card p-6", className)} {...props}>
      {children}
    </View>
  );
}

interface DialogHeaderProps extends ViewProps {
  className?: string;
  onClose?: () => void;
}

function DialogHeader({ className, onClose, children, ...props }: DialogHeaderProps) {
  return (
    <View className={cn("flex-row items-center justify-between mb-4", className)} {...props}>
      <View className="flex-1">{children}</View>
      {onClose && (
        <TouchableOpacity onPress={onClose} className="p-1">
          <Ionicons name="close" size={24} color="#737373" />
        </TouchableOpacity>
      )}
    </View>
  );
}

interface DialogTitleProps extends TextProps {
  className?: string;
}

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return <Text className={cn("text-lg font-semibold text-foreground", className)} {...props} />;
}

interface DialogDescriptionProps extends TextProps {
  className?: string;
}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return <Text className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

interface DialogFooterProps extends ViewProps {
  className?: string;
}

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return <View className={cn("flex-row gap-3 mt-4 justify-end", className)} {...props} />;
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  type DialogProps,
};
