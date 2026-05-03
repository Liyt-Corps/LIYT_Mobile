import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { RootState, AppDispatch } from '@/store/store';
import { fetchProfile, logout } from '@/store/slices/authSlice';
import { useAppAlert } from '@/components/alerts/AppAlertProvider';

export default function SettingsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const [refreshing, setRefreshing] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [locationEnabled, setLocationEnabled] = useState(true);
    const { showAlert } = useAppAlert();

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchProfile());
        }, [dispatch])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchProfile());
        setRefreshing(false);
    }, [dispatch]);

    const handleLogout = () => {
        showAlert({
            title: 'Logout',
            message: 'Are you sure you want to logout?',
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await dispatch(logout());
                        router.replace('/auth/login');
                    },
                },
            ],
        });
    };

    const name = user?.full_name || user?.name || 'Driver';
    const email = user?.email || 'No email';
    const phone = user?.phone || 'No phone';
    const vehicleType = user?.vehicle_type || 'Not set';
    const status = user?.status || 'active';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={Colors.accent}
                        colors={[Colors.accent]}
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <IconSymbol name="chevron.left" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={styles.placeholder} />
                </View>

                {/* Profile Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Profile</Text>
                    <View style={styles.profileCard}>
                        <View style={styles.avatarLarge}>
                            <Text style={styles.avatarText}>{name.charAt(0)}</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>{name}</Text>
                            <Text style={styles.profileStatus}>{status}</Text>
                        </View>
                    </View>
                </View>

                {/* Account Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <IconSymbol name="envelope.fill" size={20} color={Colors.textSecondary} />
                            <Text style={styles.infoText}>{email}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <IconSymbol name="phone.fill" size={20} color={Colors.textSecondary} />
                            <Text style={styles.infoText}>{phone}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <IconSymbol name="car.fill" size={20} color={Colors.textSecondary} />
                            <Text style={styles.infoText}>{vehicleType}</Text>
                        </View>
                    </View>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleLeft}>
                                <IconSymbol name="bell.fill" size={20} color={Colors.textSecondary} />
                                <Text style={styles.toggleText}>Push Notifications</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: Colors.border, true: Colors.accent }}
                                thumbColor={Colors.white}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.toggleRow}>
                            <View style={styles.toggleLeft}>
                                <IconSymbol name="location.fill" size={20} color={Colors.textSecondary} />
                                <Text style={styles.toggleText}>Location Services</Text>
                            </View>
                            <Switch
                                value={locationEnabled}
                                onValueChange={setLocationEnabled}
                                trackColor={{ false: Colors.border, true: Colors.accent }}
                                thumbColor={Colors.white}
                            />
                        </View>
                    </View>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="questionmark.circle.fill" size={20} color={Colors.white} />
                            <Text style={styles.menuItemText}>Help & Support</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="doc.text.fill" size={20} color={Colors.white} />
                            <Text style={styles.menuItemText}>Terms of Service</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="shield.fill" size={20} color={Colors.white} />
                            <Text style={styles.menuItemText}>Privacy Policy</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="arrow.right.square.fill" size={20} color={Colors.urgent} />
                            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>LIYT Driver v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
    },
    content: {
        flex: 1,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.white,
    },
    placeholder: {
        width: 40,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 12,
    },
    profileCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarLarge: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: Colors.cardBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: '600',
        color: Colors.white,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 4,
    },
    profileStatus: {
        fontSize: 14,
        color: Colors.accent,
        textTransform: 'capitalize',
    },
    infoCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 16,
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 8,
    },
    infoText: {
        fontSize: 16,
        color: Colors.white,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 8,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    toggleText: {
        fontSize: 16,
        color: Colors.white,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: '500',
    },
    logoutItem: {
        marginTop: 16,
    },
    logoutText: {
        color: Colors.urgent,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    footerText: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
});
