import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { RootState, AppDispatch } from '@/store/store';
import { fetchDeliveryById, acceptDelivery, pickupDelivery, completeDelivery, clearCurrentDelivery } from '@/store/slices/deliveriesSlice';
import { useAppAlert } from '@/components/alerts/AppAlertProvider';

export default function JobDetailsScreen() {
    const params = useLocalSearchParams();
    const jobId = params.id as string;
    const dispatch = useDispatch<AppDispatch>();
    const { currentDelivery, loading } = useSelector((state: RootState) => state.deliveries);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const insets = useSafeAreaInsets();
    const { showAlert } = useAppAlert();

    useEffect(() => {
        if (jobId && !isFocused) {
            setIsFocused(true);
            dispatch(fetchDeliveryById(jobId));
        }
        return () => {
            dispatch(clearCurrentDelivery());
        };
    }, [dispatch, jobId, isFocused]);

    const handleAccept = async () => {
        showAlert({
            title: 'Accept Job',
            message: 'Are you sure you want to accept this delivery?',
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Accept',
                    onPress: async () => {
                        setIsProcessing(true);
                        try {
                            await dispatch(acceptDelivery(jobId)).unwrap();
                            await dispatch(fetchDeliveryById(jobId)).unwrap();
                            showAlert({
                                title: 'Success',
                                message: 'Job accepted successfully!',
                                buttons: [{ text: 'OK' }],
                            });
                        } catch (error: any) {
                            showAlert({ title: 'Error', message: error || 'Failed to accept job' });
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                },
            ],
        });
    };

    const handlePickup = async () => {
        showAlert({
            title: 'Mark as Picked Up',
            message: 'Confirm that you have picked up the package?',
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setIsProcessing(true);
                        try {
                            await dispatch(pickupDelivery(jobId)).unwrap();
                            showAlert({ title: 'Success', message: 'Package marked as picked up!' });
                        } catch (error: any) {
                            showAlert({ title: 'Error', message: error || 'Failed to mark as picked up' });
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                },
            ],
        });
    };

    const handleComplete = async () => {
        showAlert({
            title: 'Complete Delivery',
            message: 'Confirm that the package has been delivered?',
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        setIsProcessing(true);
                        try {
                            await dispatch(completeDelivery(jobId)).unwrap();
                            showAlert({
                                title: 'Success',
                                message: 'Delivery completed!',
                                buttons: [{ text: 'OK', onPress: () => router.back() }],
                            });
                        } catch (error: any) {
                            showAlert({ title: 'Error', message: error || 'Failed to complete delivery' });
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                },
            ],
        });
    };

    const job = currentDelivery;

    if (!job) {
        return (
            <View style={styles.container}>
                <Stack.Screen options={{ headerShown: false }} />
                <View style={styles.loadingContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.accent} />
                    ) : (
                        <Text style={styles.errorText}>Job not found</Text>
                    )}
                </View>
            </View>
        );
    }

    const handleButtonPress = () => {
        switch (job.status) {
            case 'pending':
                handleAccept();
                break;
            case 'accepted':
                handlePickup();
                break;
            case 'picked_up':
            case 'in_transit':
                handleComplete();
                break;
            default:
                handleAccept();
        }
    };

    const getCoordinates = (stop: any) => {
        if (!stop) return null;
        
        // Try direct lat/lng on the stop
        if (stop.latitude && stop.longitude) {
            return {
                latitude: parseFloat(String(stop.latitude)),
                longitude: parseFloat(String(stop.longitude))
            };
        }
        
        // Try nested coordinates
        if (stop.coordinates?.lat && stop.coordinates?.lng) {
            return {
                latitude: parseFloat(String(stop.coordinates.lat)),
                longitude: parseFloat(String(stop.coordinates.lng))
            };
        }
        
        // Try geo coordinates
        if (stop.geo?.latitude && stop.geo?.longitude) {
            return {
                latitude: parseFloat(String(stop.geo.latitude)),
                longitude: parseFloat(String(stop.geo.longitude))
            };
        }
        
        return null;
    };

    const defaultPickup = { latitude: 9.0222, longitude: 38.7468 }; // Addis Ababa
    const defaultDropoff = { latitude: 9.0054, longitude: 38.7636 };

    const pickupCoords = getCoordinates(job.pickup) || getCoordinates(job.pickup_address) || defaultPickup;
    const dropoffCoords = getCoordinates(job.dropoff) || getCoordinates(job.dropoff_address) || defaultDropoff;

    const mapRegion = {
        latitude: (pickupCoords.latitude + dropoffCoords.latitude) / 2,
        longitude: (pickupCoords.longitude + dropoffCoords.longitude) / 2,
        latitudeDelta: Math.abs(pickupCoords.latitude - dropoffCoords.latitude) * 2 || 0.05,
        longitudeDelta: Math.abs(pickupCoords.longitude - dropoffCoords.longitude) * 2 || 0.05,
    };

    const getButtonText = () => {
        switch (job.status) {
            case 'pending':
                return 'Accept Job';
            case 'accepted':
                return 'Mark Picked Up';
            case 'picked_up':
            case 'in_transit':
                return 'Complete Delivery';
            case 'delivered':
                return 'Delivered';
            default:
                return 'Accept Job';
        }
    };

    const isButtonDisabled = job.status === 'delivered' || job.status === 'cancelled';

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Map Container with Overlays */}
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={mapRegion}
                        provider={undefined}
                    >
                        <Polyline
                            coordinates={[pickupCoords, dropoffCoords]}
                            strokeColor={Colors.accent}
                            strokeWidth={4}
                        />

                        <Marker coordinate={pickupCoords} title="Pickup">
                            <View style={styles.markerPickup}>
                                <IconSymbol name="shippingbox.fill" size={16} color={Colors.secondary} />
                            </View>
                        </Marker>

                        <Marker coordinate={dropoffCoords} title="Drop-off">
                            <View style={styles.markerDropoff}>
                                <IconSymbol name="mappin.circle.fill" size={16} color={Colors.white} />
                            </View>
                        </Marker>
                    </MapView>

                    {/* Overlay Header - Back, Title, Share */}
                    <View style={[styles.overlayHeader, { paddingTop: Math.max(insets.top, 16) }]}>
                        <TouchableOpacity
                            style={styles.overlayButton}
                            onPress={() => router.replace('/(tabs)')}
                        >
                            <IconSymbol name="chevron.left" size={24} color={Colors.white} />
                        </TouchableOpacity>
                        <Text style={styles.overlayTitle}>Job Details</Text>
                        <TouchableOpacity style={styles.overlayButton}>
                            <IconSymbol name="square.and.arrow.up" size={24} color={Colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Stats Cards Floating Over Map */}
                    <View style={styles.floatingStatsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Payout</Text>
                            <Text style={styles.statValue}>ETB {Number(job.price).toFixed(2)}</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Distance</Text>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statUnit}>mi</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Text style={styles.statLabel}>Est. Time</Text>
                            <Text style={styles.statValue}>0</Text>
                            <Text style={styles.statUnit}>min</Text>
                        </View>
                    </View>
                </View>

                {/* Route Timeline */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Route Timeline</Text>

                    {/* Pickup */}
                    <View style={styles.timelineItem}>
                        <View style={styles.timelineIconContainer}>
                            <View style={styles.pickupIconBg}>
                                <IconSymbol name="shippingbox.fill" size={20} color={Colors.accent} />
                            </View>
                        </View>
                        <View style={styles.timelineContent}>
                            <View style={styles.timelineHeader}>
                                <Text style={styles.timelineTitle}>
                                    Pickup
                                </Text>
                                <View style={styles.readyBadge}>
                                    <Text style={styles.readyText}>Ready</Text>
                                </View>
                            </View>
                            <Text style={styles.timelineAddress}>
                                {job.pickup?.address1 || 'Pickup Location'}
                            </Text>
                            <Text style={styles.timelineAddress}>
                                {job.pickup?.city}, {job.pickup?.region}
                            </Text>
                            <Text style={styles.timelineContact}>
                                {job.pickup?.contact_name} • {job.pickup?.contact_phone}
                            </Text>
                        </View>
                    </View>

                    {/* Timeline Line */}
                    <View style={styles.timelineLine} />

                    {/* Drop-off */}
                    <View style={styles.timelineItem}>
                        <View style={styles.timelineIconContainer}>
                            <View style={styles.dropoffIconBg}>
                                <IconSymbol name="mappin.circle.fill" size={20} color={Colors.white} />
                            </View>
                        </View>
                        <View style={styles.timelineContent}>
                            <View style={styles.timelineHeader}>
                                <Text style={styles.timelineTitle}>
                                    Drop-off
                                </Text>
                                <View style={styles.timeBadge}>
                                    <Text style={styles.timeText}>Pending</Text>
                                </View>
                            </View>
                            <Text style={styles.timelineAddress}>
                                {job.dropoff?.address1 || 'Drop-off Location'}
                            </Text>
                            <Text style={styles.timelineAddress}>
                                {job.dropoff?.city}, {job.dropoff?.region}
                            </Text>
                            {job.customer && (
                                <Text style={styles.timelineContact}>
                                    {job.customer.full_name} • {job.customer.phone}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Business Info */}
                {job.business && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Business</Text>
                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <IconSymbol name="building.2.fill" size={20} color={Colors.textSecondary} />
                                <Text style={styles.infoText}>{job.business.name}</Text>
                            </View>
                            {job.description && (
                                <>
                                    <View style={styles.divider} />
                                    <View style={styles.infoRow}>
                                        <IconSymbol name="doc.text.fill" size={20} color={Colors.textSecondary} />
                                        <Text style={styles.infoText}>{job.description}</Text>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                )}

                {/* Package Information */}
                {job.items && job.items.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.packageHeader}>
                            <IconSymbol name="info.circle.fill" size={20} color={Colors.accent} />
                            <Text style={styles.sectionTitle}>Package Information</Text>
                        </View>

                        <View style={styles.packageCard}>
                            {job.items?.map((item, index) => (
                                <View key={item.id || index}>
                                    <View style={styles.packageRow}>
                                        <View style={styles.packageInfo}>
                                            <Text style={styles.packageLabel}>Item</Text>
                                            <Text style={styles.packageValue}>{item.name}</Text>
                                        </View>
                                        <View style={styles.packageInfo}>
                                            <Text style={styles.packageLabel}>Qty</Text>
                                            <Text style={styles.packageValue}>{item.quantity}</Text>
                                        </View>
                                    </View>
                                    {index < (job.items?.length || 0) - 1 && <View style={styles.divider} />}
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Status Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Status</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <IconSymbol name="clock.fill" size={20} color={Colors.textSecondary} />
                            <Text style={styles.infoText}>
                                {job.status === 'pending' && 'Waiting for acceptance'}
                                {job.status === 'accepted' && 'Accepted - Ready for pickup'}
                                {job.status === 'picked_up' && 'Package picked up'}
                                {job.status === 'in_transit' && 'In transit'}
                                {job.status === 'delivered' && 'Delivered'}
                                {job.status === 'cancelled' && 'Cancelled'}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Accept Job Button */}
            {!isButtonDisabled && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.acceptButton, isProcessing && styles.disabledButton]}
                        onPress={handleButtonPress}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <ActivityIndicator size="small" color={Colors.secondary} />
                        ) : (
                            <>
                                <Text style={styles.acceptButtonText}>{getButtonText()}</Text>
                                <IconSymbol name="arrow.right" size={24} color={Colors.secondary} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}
        </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: Colors.textSecondary,
        fontSize: 16,
    },
    mapContainer: {
        position: 'relative',
        height: 350,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerDriver: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    markerPickup: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.accent,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.secondary,
    },
    markerDropoff: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#EF4444',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    overlayHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 8,
        zIndex: 10,
        backgroundColor: 'rgba(24, 24, 27, 0.85)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
    },
    overlayButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 18,
    },
    overlayTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.white,
    },
    floatingStatsContainer: {
        position: 'absolute',
        bottom: -40,
        left: 16,
        right: 16,
        flexDirection: 'row',
        gap: 12,
        zIndex: 100,
    },
    statCard: {
        flex: 1,
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.accent,
    },
    statUnit: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 60,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
        marginBottom: 16,
    },
    packageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    timelineItem: {
        flexDirection: 'row',
    },
    timelineIconContainer: {
        width: 40,
        alignItems: 'center',
    },
    pickupIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropoffIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.cardBg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineLine: {
        width: 2,
        height: 30,
        backgroundColor: Colors.border,
        marginLeft: 18,
        marginVertical: 4,
    },
    timelineContent: {
        flex: 1,
        marginLeft: 12,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 6,
    },
    timelineTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
        flex: 1,
    },
    readyBadge: {
        backgroundColor: Colors.success + '20',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    readyText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.success,
    },
    timeBadge: {
        backgroundColor: Colors.fragile + '20',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    timeText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.fragile,
    },
    timelineAddress: {
        fontSize: 14,
        color: Colors.white,
        marginBottom: 2,
    },
    timelineContact: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 16,
    },
    infoCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        fontSize: 14,
        color: Colors.white,
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 12,
    },
    packageCard: {
        backgroundColor: Colors.secondary,
        borderRadius: 12,
        padding: 16,
    },
    packageRow: {
        flexDirection: 'row',
        gap: 24,
    },
    packageInfo: {
        flex: 1,
    },
    packageLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 6,
    },
    packageValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white,
    },
    footer: {
        padding: 20,
        backgroundColor: Colors.primary,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    acceptButton: {
        backgroundColor: Colors.accent,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 12,
    },
    disabledButton: {
        opacity: 0.6,
    },
    acceptButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.secondary,
    },
});
