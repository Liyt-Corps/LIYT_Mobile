import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';

interface JobCardProps {
    jobId: string;
    pickupLocation: string;
    pickupAddress: string;
    dropoffLocation: string;
    dropoffAddress: string;
    distance: string;
    estimatedTime: string;
    price: number;
    tags: string[];
    onPress?: () => void;
}

export function JobCard({
    jobId,
    pickupLocation,
    pickupAddress,
    dropoffLocation,
    dropoffAddress,
    distance,
    estimatedTime,
    price,
    tags,
    onPress,
}: JobCardProps) {
    const handlePress = () => {
        // Only navigate if onPress callback doesn't handle it
        if (onPress) {
            onPress();
        } else {
            router.push(`/job-details?id=${jobId}` as any);
        }
    };
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            {/* Pickup Location */}
            <View style={styles.locationRow}>
                <View style={styles.iconContainer}>
                    <View style={[styles.locationDot, styles.pickupDot]} />
                </View>
                <View style={styles.locationInfo}>
                    <Text style={styles.locationLabel}>{pickupLocation}</Text>
                    <Text style={styles.locationAddress}>{pickupAddress}</Text>
                </View>
                <View style={styles.distanceInfo}>
                    <Text style={styles.distanceText}>{distance}</Text>
                    <Text style={styles.timeText}>{estimatedTime}</Text>
                </View>
            </View>

            {/* Drop-off Location */}
            <View style={[styles.locationRow, styles.dropoffRow]}>
                <View style={styles.iconContainer}>
                    <View style={[styles.locationDot, styles.dropoffDot]} />
                </View>
                <View style={styles.locationInfo}>
                    <Text style={styles.locationLabel}>{dropoffLocation}</Text>
                    <Text style={styles.locationAddress}>{dropoffAddress}</Text>
                </View>
            </View>

            {/* Tags and Price */}
            <View style={styles.footer}>
                <View style={styles.tagsContainer}>
                    {tags.map((tag, index) => (
                        <View
                            key={index}
                            style={[
                                styles.tag,
                                tag === 'Urgent' && styles.urgentTag,
                                tag === 'Fragile' && styles.fragileTag,
                            ]}
                        >
                            <Text style={styles.tagText}>{tag}</Text>
                        </View>
                    ))}
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>ETB {Number(price).toFixed(2)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.secondary,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    dropoffRow: {
        marginBottom: 16,
    },
    iconContainer: {
        width: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        paddingTop: 2,
    },
    locationDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    pickupDot: {
        backgroundColor: Colors.accent,
    },
    dropoffDot: {
        backgroundColor: '#EF4444',
    },
    locationInfo: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    locationAddress: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: '500',
    },
    distanceInfo: {
        alignItems: 'flex-end',
    },
    distanceText: {
        fontSize: 16,
        color: Colors.white,
        fontWeight: '600',
        marginBottom: 2,
    },
    timeText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: Colors.cardBg,
    },
    urgentTag: {
        backgroundColor: '#7C2D12',
    },
    fragileTag: {
        backgroundColor: '#78350F',
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.white,
    },
    priceContainer: {
        backgroundColor: Colors.accent,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    priceText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondary,
    },
});
