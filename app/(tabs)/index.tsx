import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useFocusEffect } from 'expo-router';
import { AppHeader } from '@/components/AppHeader';
import { StatsCard } from '@/components/StatsCard';
import { JobCard } from '@/components/JobCard';
import { Colors } from '@/constants/theme';
import { RootState, AppDispatch } from '@/store/store';
import { fetchDeliveries } from '@/store/slices/deliveriesSlice';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'available' | 'current'>('available');
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

  const availableJobs = deliveries.filter(job => job.status === 'pending');
  const currentJobs = deliveries.filter(job => ['accepted', 'picked_up', 'in_transit'].includes(job.status));

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
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Today's Earnings"
            value="$0.00"
          />
          <View style={styles.statsGap} />
          <StatsCard
            title="Online Time"
            value="0h 0m"
          />
        </View>

        {/* Available / Current Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
              Available
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'current' && styles.activeTab]}
            onPress={() => setActiveTab('current')}
          >
            <Text style={[styles.tabText, activeTab === 'current' && styles.activeTabText]}>
              Current
            </Text>
          </TouchableOpacity>
        </View>

        {/* Jobs List */}
        <View style={styles.jobsSection}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'available' ? 'Available Jobs' : 'Current Jobs'} ({activeTab === 'available' ? availableJobs.length : currentJobs.length})
          </Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.accent} />
            </View>
          )}

          {!loading && activeTab === 'available' && availableJobs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No available jobs</Text>
              <Text style={styles.emptyStateSubtext}>
                Check back later for new delivery requests
              </Text>
            </View>
          )}

          {!loading && activeTab === 'available' && availableJobs.map((job) => (
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
              tags={[]}
            />
          ))}

          {!loading && activeTab === 'current' && currentJobs.map((job) => (
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

          {!loading && activeTab === 'current' && currentJobs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No current jobs</Text>
              <Text style={styles.emptyStateSubtext}>
                Browse available jobs to get started
              </Text>
            </View>
          )}
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
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statsGap: {
    width: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.accent,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.secondary,
  },
  jobsSection: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 16,
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
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
});

