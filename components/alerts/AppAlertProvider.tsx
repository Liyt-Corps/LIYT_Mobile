import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';

export type AppAlertButtonStyle = 'default' | 'cancel' | 'destructive';

export type AppAlertButton = {
  text: string;
  onPress?: () => void | Promise<void>;
  style?: AppAlertButtonStyle;
};

export type AppAlertPayload = {
  title?: string;
  message?: string;
  buttons?: AppAlertButton[];
  options?: {
    cancelable?: boolean;
  };
};

type AppAlertContextValue = {
  showAlert: (payload: AppAlertPayload) => void;
  dismissAlert: () => void;
};

const AppAlertContext = createContext<AppAlertContextValue | null>(null);

export function useAppAlert(): AppAlertContextValue {
  const ctx = useContext(AppAlertContext);
  if (!ctx) throw new Error('useAppAlert must be used within AppAlertProvider');
  return ctx;
}

export function AppAlertProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const payloadRef = useRef<AppAlertPayload | null>(null);
  const [, forceRerender] = useState(0);
  const isDismissingRef = useRef(false);

  const dismissAlert = useCallback(() => {
    if (isDismissingRef.current) return;
    isDismissingRef.current = true;
    setVisible(false);
    // Allow Modal close animation to complete before allowing new opens.
    setTimeout(() => {
      isDismissingRef.current = false;
      payloadRef.current = null;
      forceRerender((v) => v + 1);
    }, 50);
  }, []);

  const showAlert = useCallback((payload: AppAlertPayload) => {
    payloadRef.current = payload;
    forceRerender((v) => v + 1);
    setVisible(true);
  }, []);

  const value = useMemo(() => ({ showAlert, dismissAlert }), [showAlert, dismissAlert]);

  const payload = payloadRef.current;
  const title = payload?.title ?? '';
  const message = payload?.message ?? '';
  const cancelable = payload?.options?.cancelable ?? true;

  const buttons: AppAlertButton[] =
    payload?.buttons && payload.buttons.length > 0 ? payload.buttons : [{ text: 'OK', style: 'default' }];

  const handleBackdropPress = () => {
    if (!cancelable) return;
    dismissAlert();
  };

  const handleButtonPress = async (button: AppAlertButton) => {
    dismissAlert();
    try {
      await button.onPress?.();
    } catch {
      // Swallow errors to avoid unhandled promise rejections from UI callbacks.
    }
  };

  const isTwoButtons = buttons.length === 2;

  return (
    <AppAlertContext.Provider value={value}>
      {children}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={dismissAlert}>
        <View style={styles.backdrop}>
          <Pressable style={styles.backdropPressable} onPress={handleBackdropPress} />

          <View style={styles.card}>
            {!!title && <Text style={styles.title}>{title}</Text>}
            {!!message && <Text style={styles.message}>{message}</Text>}

            <View style={[styles.buttonsRow, !isTwoButtons && styles.buttonsColumn]}>
              {buttons.map((b, idx) => (
                <Pressable
                  key={`${b.text}-${idx}`}
                  onPress={() => handleButtonPress(b)}
                  style={({ pressed }) => [
                    styles.buttonBase,
                    isTwoButtons ? styles.buttonHalf : styles.buttonFull,
                    pressed && styles.buttonPressed,
                    b.style === 'destructive' && styles.buttonDestructive,
                    b.style === 'cancel' && styles.buttonCancel,
                  ]}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      b.style === 'destructive' && styles.buttonTextDestructive,
                      b.style === 'cancel' && styles.buttonTextCancel,
                    ]}
                  >
                    {b.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </AppAlertContext.Provider>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonsColumn: {
    flexDirection: 'column',
  },
  buttonBase: {
    minHeight: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  buttonHalf: { flex: 1 },
  buttonFull: { width: '100%' },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonCancel: {
    backgroundColor: Colors.primary,
  },
  buttonDestructive: {
    borderColor: Colors.urgent,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  buttonTextCancel: {
    color: Colors.textSecondary,
  },
  buttonTextDestructive: {
    color: Colors.urgent,
  },
});

