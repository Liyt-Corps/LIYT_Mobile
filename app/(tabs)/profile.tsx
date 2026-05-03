import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useFocusEffect } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { RootState, AppDispatch } from '@/store/store';
import { fetchProfile, logout } from '@/store/slices/authSlice';
import { useAppAlert } from '@/components/alerts/AppAlertProvider';

export default function ProfileScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const [refreshing, setRefreshing] = useState(false);
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
    const rating = user?.rating?.toFixed(1) || 'N/A';
    const vehicleType = user?.vehicle_type || 'Not set';
    const licenseNumber = user?.license_number || 'Not set';
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
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarLarge}>
                        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.name}>{name}</Text>
                    <View style={styles.ratingContainer}>
                        <IconSymbol name="star.fill" size={20} color={Colors.accent} />
                        <Text style={styles.rating}>{rating}</Text>
                        <Text style={styles.tripsText}>• {status}</Text>
                    </View>
                </View>

                {/* Contact Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Contact Information</Text>
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
                    </View>
                </View>

                {/* Vehicle Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vehicle Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <IconSymbol name="car.fill" size={20} color={Colors.textSecondary} />
                            <Text style={styles.infoText}>
                                {vehicleType}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <IconSymbol name="number" size={20} color={Colors.textSecondary} />
                            <Text style={styles.infoText}>{licenseNumber}</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="person.fill" size={20} color={Colors.white} />
                            <Text style={styles.menuItemText}>Account Settings</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="bell.fill" size={20} color={Colors.white} />
                            <Text style={styles.menuItemText}>Notifications</Text>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <IconSymbol name="questionmark.circle.fill" size={20} color={Colors.white} />
                            <Text style={styles.menuItemText}>Help & Support</Text>
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
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    avatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.cardBg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: '600',
        color: Colors.white,
    },
    name: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.white,
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    rating: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
    },
    tripsText: {
        fontSize: 16,
        color: Colors.textSecondary,
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
});
