import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAppAlert } from '@/components/alerts/AppAlertProvider';

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [vehicleType, setVehicleType] = useState('car');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const { showAlert } = useAppAlert();

    const handleRegister = async () => {
        if (!email || !password || !fullName || !phone) {
            // Basic validation
            return;
        }
        if (password !== confirmPassword) {
            // TODO: dispatch local error
            return;
        }

        const resultAction = await dispatch(register({
            full_name: fullName,
            email,
            phone,
            vehicle_type: vehicleType,
            license_number: licenseNumber,
            password
        }));
        if (register.fulfilled.match(resultAction)) {
            showAlert({
                title: 'Success',
                message: 'Account created successfully! Please log in.',
                buttons: [{ text: 'OK', onPress: () => router.push('/auth/login') }],
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Logo Area */}
                <View style={styles.header}>
                    <Image
                        source={require('@/assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Form Card */}
                <View style={styles.card}>
                    <Text style={styles.title}>Create account</Text>
                    <Text style={styles.subtitle}>Join thousands of logistics professionals</Text>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name *</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol name="person" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor={Colors.textMuted}
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address *</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol name="envelope" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="name@company.com"
                                placeholderTextColor={Colors.textMuted}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number *</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol name="phone.fill" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="+251..."
                                placeholderTextColor={Colors.textMuted}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Vehicle Type *</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol name="car.fill" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Car, Truck, Bike..."
                                placeholderTextColor={Colors.textMuted}
                                value={vehicleType}
                                onChangeText={setVehicleType}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>License Number *</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol name="identification" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="DL-123456"
                                placeholderTextColor={Colors.textMuted}
                                value={licenseNumber}
                                onChangeText={setLicenseNumber}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password *</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.textMuted}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <IconSymbol
                                    name={showPassword ? "eye" : "eye.slash"}
                                    size={20}
                                    color={Colors.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password *</Text>
                        <View style={styles.inputContainer}>
                            <IconSymbol name="lock" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={Colors.textMuted}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.primary} />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>Create Account</Text>
                                <IconSymbol name="arrow.right" size={20} color={Colors.primary} />
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or sign up with</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <IconSymbol name="g.circle.fill" size={24} color={Colors.white} />
                            <Text style={styles.socialText}>Google</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <IconSymbol name="apple.logo" size={24} color={Colors.white} />
                            <Text style={styles.socialText}>Github</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/auth/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.linkText}>Sign in</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>

                {/* Bottom Link */}
                <TouchableOpacity style={styles.backHome} onPress={() => router.push('/')}>
                    <Text style={styles.backHomeText}>← Back to home</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30, // Slightly less margin for register
        marginTop: 40,
    },
    logo: {
        width: 120,
        height: 40,
        tintColor: Colors.accent,
    },
    card: {
        backgroundColor: '#18181B',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#27272A',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
    },
    errorContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 16, // Tighter spacing for register form
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#27272A',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#3F3F46',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        color: Colors.white,
        fontSize: 16,
    },
    button: {
        backgroundColor: Colors.accent,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 16,
        marginBottom: 24,
    },
    buttonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#3F3F46',
    },
    dividerText: {
        color: Colors.textSecondary,
        paddingHorizontal: 16,
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#27272A',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#3F3F46',
    },
    socialText: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    linkText: {
        color: Colors.accent,
        fontSize: 14,
        fontWeight: '700',
    },
    backHome: {
        alignItems: 'center',
        marginTop: 32,
    },
    backHomeText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
});
