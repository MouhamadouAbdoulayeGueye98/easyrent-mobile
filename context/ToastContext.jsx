
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ToastContext = createContext(null);

const TOAST_CONFIG = {
  success: {
    title: "Succès",
    backgroundColor: "#15803D",
    symbol: "✓",
  },
  error: {
    title: "Erreur",
    backgroundColor: "#B91C1C",
    symbol: "!",
  },
  info: {
    title: "Information",
    backgroundColor: "#1D4ED8",
    symbol: "i",
  },
};

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setToast(null);
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3000) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const safeType = TOAST_CONFIG[type] ? type : "info";

      setToast({
        message: String(message),
        type: safeType,
        id: Date.now(),
      });

      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, duration);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {toast && (
        <ToastOverlay
          toast={toast}
          onPress={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast doit être utilisé dans ToastProvider.",
    );
  }

  return context;
}

function ToastOverlay({ toast, onPress }) {
  const insets = useSafeAreaInsets();
  const config = TOAST_CONFIG[toast.type];

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.overlay,
        { top: insets.top + 12 },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        accessibilityRole="alert"
        accessibilityLabel={`${config.title} : ${toast.message}`}
        style={[
          styles.toast,
          { backgroundColor: config.backgroundColor },
        ]}
      >
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>
            {config.symbol}
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {config.title}
          </Text>

          <Text style={styles.message}>
            {toast.message}
          </Text>
        </View>

        <Text style={styles.close}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    elevation: 9999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    minHeight: 68,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  symbolContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.8)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  symbol: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 3,
  },
  message: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 19,
  },
  close: {
    color: "#FFFFFF",
    fontSize: 24,
    marginLeft: 10,
    opacity: 0.9,
  },
});
