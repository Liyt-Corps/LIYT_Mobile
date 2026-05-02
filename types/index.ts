export interface Job {
    id: string;
    pickupLocation: string;
    pickupAddress: string;
    dropoffLocation: string;
    dropoffAddress: string;
    distance: string;
    estimatedTime: string;
    price: number;
    tags: string[];
    status: 'available' | 'current' | 'completed' | 'cancelled';
}

export interface DriverStats {
    todayEarnings: number;
    onlineTime: string;
    totalJobs: number;
    completedJobs: number;
    rating: number;
}

export interface Transaction {
    id: string;
    amount: number;
    date: string;
    type: 'earning' | 'withdrawal' | 'bonus';
    description: string;
    status: 'completed' | 'pending';
}

export interface Driver {
    id: number;
    email: string;
    full_name: string;
    phone: string;
    status: string;
    vehicle_type: string | null;
    license_number: string | null;
    verified_at: string | null;
    rating: number | null;
    last_latitude: number | null;
    last_longitude: number | null;
    last_location_at: string | null;
}

export interface User {
    id: string | number;
    full_name: string;
    email: string;
    phone: string;
    vehicle_type?: string;
    license_number?: string;
    status?: string;
    rating?: number | null;
    verified_at?: string | null;
    avatar?: string;
    name?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface DriverProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    rating: number;
    totalTrips: number;
    vehicleInfo: {
        make: string;
        model: string;
        year: number;
        licensePlate: string;
    };
}

export interface DeliveryAddress {
    city: string;
    region: string;
    address1?: string;
    latitude?: string | number;
    longitude?: string | number;
}

export interface DeliveryStop {
    id: number;
    kind: 'pickup' | 'dropoff';
    sequence: number;
    address1?: string;
    city: string;
    region: string;
    contact_name: string;
    contact_phone: string;
    latitude?: string | number;
    longitude?: string | number;
}

export interface DeliveryItem {
    id: number;
    name: string;
    quantity: number;
}

export interface Delivery {
    id: number;
    public_id: string;
    status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
    price: number;
    description?: string;
    business_id: number;
    driver_id: number | null;
    customer_id: number | null;
    accepted_at: string | null;
    picked_up_at: string | null;
    delivered_at: string | null;
    cancelled_at: string | null;
    created_at: string;
    pickup?: DeliveryStop;
    dropoff?: DeliveryStop;
    pickup_address?: DeliveryAddress;
    dropoff_address?: DeliveryAddress;
    // Potential coordinate fields
    latitude?: number | string;
    longitude?: number | string;
    coordinates?: { lat?: number | string; lng?: number | string };
    geo?: { latitude?: number | string; longitude?: number | string };
    business?: {
        id: number;
        name: string;
    };
    customer?: {
        id: number;
        full_name: string;
        phone: string;
    };
    items?: DeliveryItem[];
}

export interface DeliveryState {
    deliveries: Delivery[];
    history: Delivery[];
    currentDelivery: Delivery | null;
    loading: boolean;
    error: string | null;
}
