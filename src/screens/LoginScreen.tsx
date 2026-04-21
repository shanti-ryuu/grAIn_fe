import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@/hooks';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#2E7D32',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    flexDirection: 'row',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  demoButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  demoButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },
  errorMessage: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#c62828',
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  validationError: {
    color: '#c62828',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
});

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const { login, isLoading, error, clearError } = useAuth();

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!email.includes('@')) {
      errors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      // Error is handled by the useAuth hook
    }
  };

  const handleDemoLogin = async () => {
    setEmail('demo@graindry.com');
    setPassword('demo123');

    try {
      await login('demo@graindry.com', 'demo123');
    } catch (err) {
      // Error is handled by the useAuth hook
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (validationErrors.email) {
      setValidationErrors({ ...validationErrors, email: undefined });
    }
    if (error) {
      clearError();
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (validationErrors.password) {
      setValidationErrors({ ...validationErrors, password: undefined });
    }
    if (error) {
      clearError();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🌾</Text>
          </View>
          <Text style={styles.title}>grAIn</Text>
          <Text style={styles.subtitle}>Smart Grain Dryer Control</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[
              styles.input,
              validationErrors.email ? { borderColor: '#c62828', borderWidth: 2 } : undefined,
            ]}
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            editable={!isLoading}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholderTextColor="#999"
          />
          {validationErrors.email && (
            <Text style={styles.validationError}>{validationErrors.email}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[
              styles.input,
              validationErrors.password ? { borderColor: '#c62828', borderWidth: 2 } : undefined,
            ]}
            placeholder="Enter your password"
            value={password}
            onChangeText={handlePasswordChange}
            editable={!isLoading}
            secureTextEntry
            autoCapitalize="none"
            placeholderTextColor="#999"
          />
          {validationErrors.password && (
            <Text style={styles.validationError}>{validationErrors.password}</Text>
          )}

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Demo Login */}
          <TouchableOpacity
            style={[styles.demoButton, isLoading && { opacity: 0.7 }]}
            onPress={handleDemoLogin}
            disabled={isLoading}
          >
            <Text style={styles.demoButtonText}>Try Demo Account</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
            Secure login powered by grAIn IoT System
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
