import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import Toast from '@/components/Toast';

export default function GlobalToast() {
  const { toast, hideToast } = useAppContext();

  return (
    <View style={styles.container} pointerEvents="none">
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
});
