import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { RootState } from '@/store/store';

export function AppHeader() {
    const { user } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const userName = user?.full_name || user?.name || 'Driver';

    return (
        <View style={styles.header}>
            <View style={styles.leftSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{userName.charAt(0)}</Text>
                </View>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.userName}>{userName}</Text>
                </View>
            </View>
            <View style={styles.rightSection}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => router.push('/notifications')}
                >
                    <IconSymbol name="bell.fill" size={24} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: Colors.primary,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.cardBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.white,
    },
    greeting: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    userName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
    },
    rightSection: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
