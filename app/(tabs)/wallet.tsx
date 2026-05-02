import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { Colors } from '@/constants/theme';
import { mockDriverProfile, mockTransactions, mockDriverStats } from '@/data/mockData';

export default function WalletScreen() {
    const totalEarnings = mockTransactions
        .filter(t => t.type === 'earning' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0);

    const pendingEarnings = mockTransactions
        .filter(t => t.type === 'earning' && t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Simulate refresh - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <AppHeader />

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
                <Text style={styles.title}>Wallet</Text>

                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>ETB {totalEarnings.toFixed(2)}</Text>
                    <TouchableOpacity style={styles.withdrawButton}>
                        <Text style={styles.withdrawButtonText}>Withdraw</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Today</Text>
                        <Text style={styles.statValue}>
                            ETB {mockDriverStats.todayEarnings.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={styles.statValue}>
                            ETB {pendingEarnings.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Company Credit */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Company Credit</Text>
                    <View style={styles.creditCard}>
                        <View>
                            <Text style={styles.creditLabel}>Available Credit</Text>
                            <Text style={styles.creditAmount}>ETB 500.00</Text>
                        </View>
                    </View>
                </View>

                {/* Transaction History */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    {mockTransactions.map((transaction) => {
                        const date = new Date(transaction.date);
                        const isEarning = transaction.type === 'earning';
                        return (
                            <View key={transaction.id} style={styles.transactionCard}>
                                <View style={styles.transactionLeft}>
                                    <Text style={styles.transactionDescription}>
                                        {transaction.description}
                                    </Text>
                                    <Text style={styles.transactionDate}>
                                        {date.toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Text>
                                </View>
                                <Text style={[
                                    styles.transactionAmount,
                                    isEarning && styles.transactionAmountPositive
                                ]}>
                                    {isEarning ? '+' : '-'}ETB {transaction.amount.toFixed(2)}
                                </Text>
                            </View>
                        );
                    })}
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
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.white,
        marginTop: 24,
        marginBottom: 24,
    },
    balanceCard: {
        backgroundColor: Colors.accent,
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
    },
    balanceLabel: {
        fontSize: 16,
        color: Colors.secondary,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 42,
        fontWeight: '700',
        color: Colors.secondary,
        marginBottom: 20,
    },
    withdrawButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    withdrawButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.accent,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.secondary,
        borderRadius: 16,
        padding: 16,
    },
    statLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.white,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 12,
    },
    creditCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 16,
        padding: 20,
    },
    creditLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    creditAmount: {
        fontSize: 28,
        fontWeight: '700',
        color: Colors.white,
    },
    transactionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    transactionLeft: {
        flex: 1,
    },
    transactionDescription: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: '500',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.white,
    },
    transactionAmountPositive: {
        color: Colors.accent,
    },
});
