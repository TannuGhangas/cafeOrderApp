// app/(drawer)/Profile.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Stack, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { User, Edit2, Coffee, Zap, Plus, Minus, ChevronDown, Droplet, CupSoda, Menu, X, Save } from 'lucide-react-native';

// --- Theme and Preference Constants ---
const COLORS = {
    primary: '#6F4E37', // Coffee Brown
    secondary: '#A0522D', // Sienna
    background: '#FAF0E6', // Beige/Cream
    cardBackground: '#FFFFFF',
    textDark: '#4A2C2A', // Dark Brown Text
    textLight: '#FFF',
    border: '#EAE0D7',
};

const ALL_DRINKS = [
    { id: 'coffee', label: 'Coffee', icon: Coffee },
    { id: 'blackcoffee', label: 'Black Coffee', icon: Coffee },
    { id: 'tea', label: 'Tea', icon: CupSoda },
    { id: 'blacktea', label: 'Black Tea', icon: CupSoda },
    { id: 'greentea', label: 'Green Tea', icon: CupSoda },
    { id: 'milk', label: 'Milk', icon: Droplet },
    { id: 'water', label: 'Water', icon: Droplet },
];

const SUGAR_OPTIONS = ['None', '1', '2', '3', 'Custom'];

const INITIAL_PROFILE = {
    name: 'Tannu',
    preferences: {
        coffee: { quantity: 1, sugar: '1' },
    },
};

// Helper to generate a full set of preferences for editing
const generateFullEditPreferences = (currentPrefs) => {
    const fullPrefs = {};
    ALL_DRINKS.forEach(drink => {
        const id = drink.id;
        // Use existing preference or default to quantity 1, sugar 1
        fullPrefs[id] = {
            quantity: currentPrefs[id]?.quantity || 1,
            sugar: currentPrefs[id]?.sugar || '1',
        };
    });
    return fullPrefs;
};

// --- Custom Components ---

const QuantityControl = ({ id, quantity, updatePreference }) => (
    <View style={styles.controlGroup}>
        <Text style={styles.controlLabel}>Quantity:</Text>
        <View style={styles.buttonGroup}>
            <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updatePreference(id, 'quantity', Math.max(1, quantity - 1))}
            >
                <Minus size={18} color={COLORS.textDark} />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{quantity}</Text>
            <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updatePreference(id, 'quantity', quantity + 1)}
            >
                <Plus size={18} color={COLORS.textDark} />
            </TouchableOpacity>
        </View>
    </View>
);

const SugarSelector = ({ id, sugar, updatePreference, showSelector, setShowSelector }) => {
    const isOpen = showSelector === id;

    const handleSelect = (newValue) => {
        updatePreference(id, 'sugar', newValue);
        setShowSelector(null);
    };

    return (
        <View style={styles.controlGroup}>
            <Text style={styles.controlLabel}>Sugar:</Text>
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    style={styles.sugarHeader}
                    onPress={() => setShowSelector(isOpen ? null : id)}
                >
                    <Text style={styles.sugarValue}>{sugar}</Text>
                    <ChevronDown size={14} color={COLORS.secondary} style={isOpen && { transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>

                {isOpen && (
                    <View style={styles.sugarDropdown}>
                        {SUGAR_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.dropdownOption}
                                onPress={() => handleSelect(option)}
                            >
                                <Text style={[
                                    styles.dropdownText,
                                    option === sugar && styles.selectedOptionText
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        </View>
    );
};

const NameEditor = ({ name, setTempProfile }) => {
    const handleNameChange = (newName) => {
        setTempProfile(prev => ({
            ...prev,
            name: newName,
        }));
    };

    return (
        <TextInput
            style={styles.userNameInput}
            value={name}
            onChangeText={handleNameChange}
            placeholder="Enter Name"
            placeholderTextColor="#C0C0C0"
        />
    );
};

// --- Main Component ---
export default function Profile() {
    const [profile, setProfile] = useState(INITIAL_PROFILE);
    const [isEditing, setIsEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState(INITIAL_PROFILE);
    const [showSelector, setShowSelector] = useState(null); // Tracks which SugarSelector is open
    const navigation = useNavigation();

    const handleMenuOpen = () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
    };

    const handleEditStart = () => {
        const fullEditPreferences = generateFullEditPreferences(profile.preferences);
        setTempProfile({ name: profile.name, preferences: fullEditPreferences });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!tempProfile.name.trim()) {
            Alert.alert("Error", "Name cannot be empty.");
            return;
        }
        // Only save preferences where quantity is > 0 (or simply save all fullEditPreferences)
        // For simplicity and matching the existing structure, we save the temp preferences.
        // If you only want to save selected drinks, you'd filter tempProfile.preferences here.
        setProfile(tempProfile);
        setIsEditing(false);
        setShowSelector(null);
        Alert.alert('Success', `${tempProfile.name}'s Preferences Saved!`);
    };

    const handleCancel = () => {
        setTempProfile(profile); // Revert to saved profile
        setIsEditing(false);
        setShowSelector(null);
    };

    const updatePreference = (id, field, value) => {
        setTempProfile(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [id]: {
                    ...prev.preferences[id],
                    [field]: value
                }
            }
        }));
    };

    // Finds the first drink that has a saved preference (for View Mode)
    const getFirstPreference = () => {
        const firstKey = Object.keys(profile.preferences)[0];
        const firstDrink = ALL_DRINKS.find(d => d.id === firstKey) || ALL_DRINKS[0];
        return {
            drink: firstDrink,
            pref: profile.preferences[firstKey],
        };
    };

    const { drink: defaultDrink, pref: defaultPref } = getFirstPreference();

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Custom Fixed Header */}
            <View style={styles.customHeader}>
                <View style={styles.logoContainer}>
                    <Coffee size={28} color={COLORS.secondary} />
                    <Text style={styles.logoText}>Sip Station</Text>
                </View>
                <TouchableOpacity style={styles.menuButton} onPress={handleMenuOpen}>
                    <Menu size={26} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer}>

                {/* Profile Content Header */}
                <View style={styles.pageContentHeader}>
                    <Text style={styles.headerTitleContent}>☕ My Brew Profile</Text>
                    <TouchableOpacity
                        onPress={isEditing ? handleSave : handleEditStart}
                        style={[styles.actionButton, isEditing ? styles.saveButton : styles.editButton]}
                    >
                        {isEditing ? <Save size={20} color={COLORS.textLight} /> : <Edit2 size={20} color={COLORS.textDark} />}
                        <Text style={[styles.actionButtonText, isEditing && { color: COLORS.textLight }]}>
                            {isEditing ? 'Save' : 'Edit'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* --- PROFILE DETAILS CARD --- */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <User size={60} color={COLORS.textLight} />
                    </View>
                    {isEditing ? (
                        <NameEditor name={tempProfile.name} setTempProfile={setTempProfile} />
                    ) : (
                        <Text style={styles.userName}>{profile.name}</Text>
                    )}
                    <Text style={styles.userTagline}>Your preferred beverage settings</Text>
                </View>

                {/* --- PREFERENCES SECTION --- */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {isEditing ? '✨ Customize Menu' : '★ Default Preference'}
                    </Text>

                    {/* View Mode: Show only the default/first preference */}
                    {!isEditing && (
                        <View style={styles.defaultViewCard}>
                            <View style={styles.defaultRow}>
                                <defaultDrink.icon size={28} color={COLORS.secondary} />
                                <Text style={styles.defaultDrinkText}>
                                    {defaultDrink.label}
                                </Text>
                            </View>
                            <Text style={styles.defaultDetailText}>
                                **Quantity:** {defaultPref?.quantity || 1}
                            </Text>
                            <Text style={styles.defaultDetailText}>
                                **Sugar Level:** {defaultPref?.sugar || '1'}
                            </Text>
                        </View>
                    )}

                    {/* Edit Mode: Show all seven drinks with controls */}
                    {isEditing && ALL_DRINKS.map(drink => (
                        <View key={drink.id} style={styles.editDrinkCard}>
                            <View style={styles.editDrinkHeader}>
                                <drink.icon size={22} color={COLORS.textDark} />
                                <Text style={styles.editDrinkTitle}>{drink.label}</Text>
                            </View>

                            <View style={styles.editControls}>
                                <QuantityControl
                                    id={drink.id}
                                    quantity={tempProfile.preferences[drink.id].quantity}
                                    updatePreference={updatePreference}
                                />
                                <SugarSelector
                                    id={drink.id}
                                    sugar={tempProfile.preferences[drink.id].sugar}
                                    updatePreference={updatePreference}
                                    showSelector={showSelector}
                                    setShowSelector={setShowSelector}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                {isEditing && (
                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                        <X size={18} color={COLORS.primary} />
                        <Text style={styles.cancelButtonText}>Discard Changes</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.background },
    contentContainer: { padding: 20 },

    // --- CUSTOM HEADER STYLES ---
    customHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: COLORS.cardBackground,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        shadowColor: COLORS.textDark,
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    logoText: { fontSize: 22, fontWeight: '900', color: COLORS.secondary },
    menuButton: { padding: 8, borderRadius: 8, backgroundColor: COLORS.border },

    // --- Page Header & Actions ---
    pageContentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    headerTitleContent: { fontSize: 24, fontWeight: 'bold', color: COLORS.textDark },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 25,
        gap: 5,
    },
    editButton: { backgroundColor: COLORS.border },
    saveButton: { backgroundColor: COLORS.primary },
    actionButtonText: { color: COLORS.textDark, fontWeight: '700', fontSize: 15 },

    // --- Profile Card ---
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        marginBottom: 20,
        backgroundColor: COLORS.cardBackground,
        borderRadius: 15,
        shadowColor: COLORS.textDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    userName: { fontSize: 28, fontWeight: '900', color: COLORS.textDark, marginTop: 5 },
    userNameInput: {
        fontSize: 28,
        fontWeight: '900',
        color: COLORS.textDark,
        marginTop: 5,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        paddingHorizontal: 10,
        paddingVertical: 2,
        textAlign: 'center',
    },
    userTagline: { fontSize: 14, color: '#666' },

    // --- Preferences Section ---
    section: {
        backgroundColor: COLORS.cardBackground,
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 8,
    },

    // --- View Mode Styles ---
    defaultViewCard: {
        padding: 18,
        backgroundColor: COLORS.background, // Light background for contrast
        borderRadius: 10,
        borderLeftWidth: 5,
        borderLeftColor: COLORS.primary,
    },
    defaultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    defaultDrinkText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginLeft: 10,
    },
    defaultDetailText: {
        fontSize: 16,
        color: COLORS.textDark,
        marginLeft: 35,
        paddingVertical: 3,
    },

    // --- Edit Mode Styles ---
    editDrinkCard: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    editDrinkHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    editDrinkTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginLeft: 10,
    },
    editControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        gap: 15,
    },
    controlGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    controlLabel: {
        fontSize: 14,
        color: COLORS.primary,
        marginRight: 8,
        fontWeight: '600',
    },

    // Quantity Controls
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.border,
        borderRadius: 8,
        padding: 2,
    },
    quantityButton: {
        padding: 4,
        marginHorizontal: 4,
    },
    quantityValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
        minWidth: 20,
        textAlign: 'center',
    },

    // Sugar Selector
    sugarHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 8,
        justifyContent: 'space-between',
        backgroundColor: COLORS.background,
        minWidth: 80,
    },
    sugarValue: {
        fontSize: 16,
        color: COLORS.textDark,
        fontWeight: '600',
        marginRight: 5,
    },
    sugarDropdown: {
        position: 'absolute',
        top: 35,
        left: 0,
        zIndex: 10,
        width: '100%',
        backgroundColor: COLORS.cardBackground,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 5,
        overflow: 'hidden',
    },
    dropdownOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    dropdownText: {
        fontSize: 15,
        color: COLORS.textDark,
    },
    selectedOptionText: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },

    // Cancel Button
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 15,
        backgroundColor: COLORS.border,
        borderRadius: 12,
        marginTop: 10,
    },
    cancelButtonText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 16 },
});