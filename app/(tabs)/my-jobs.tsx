import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { JobCard } from '@/components/JobCard';
import { Colors } from '@/constants/theme';
import { RootState, AppDispatch } from '@/store/store';
import { fetchDeliveries } from '@/store/slices/deliveriesSlice';

export default function MyJobsScreen() {
    const dispatch = useDispatch<AppDispatch>();
    const [refreshing, setRefreshing] = useState(false);
    const { deliveries, loading } = useSelector((state: RootState) => state.deliveries);

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchDeliveries());
        }, [dispatch])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchDeliveries());
        setRefreshing(false);
    }, [dispatch]);

    const historyJobs = deliveries.filter(job => job.status !== 'pending');

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
                <Text style={styles.title}>My Jobs</Text>
                <Text style={styles.subtitle}>
                    {historyJobs.length} active or completed deliveries
                </Text>

                {loading && !refreshing && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.accent} />
                    </View>
                )}

                {!loading && historyJobs.length === 0 && (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>No jobs history</Text>
                        <Text style={styles.emptyStateSubtext}>
                            You have no ongoing or completed jobs.
                        </Text>
                    </View>
                )}

                {/* Job History */}
                <View style={styles.jobsList}>
                    {!loading && historyJobs.map((job) => (
                        <JobCard
                            key={job.id}
                            jobId={job.id.toString()}
                            pickupLocation={job.pickup?.city || job.pickup_address?.city || 'Pickup'}
                            pickupAddress={job.pickup?.address1 || job.pickup_address?.address1 || job.pickup?.region || 'Pickup Location'}
                            dropoffLocation={job.dropoff?.city || job.dropoff_address?.city || 'Drop-off'}
                            dropoffAddress={job.dropoff?.address1 || job.dropoff_address?.address1 || job.dropoff?.region || 'Drop-off Location'}
                            distance="0"
                            estimatedTime="0 min"
                            price={Number(job.price)}
                            tags={[job.status.replace('_', ' ')]}
                        />
                    ))}
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
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        marginBottom: 24,
    },
    jobsList: {
        paddingBottom: 100,
    },
    loadingContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
});
