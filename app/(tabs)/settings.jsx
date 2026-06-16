import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { theme, spacing, typography } from '@/theme';
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { AppHeader } from '@/components/AppHeader';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { getUserProfile, updateUserProfile } from '@/api/user';
import { resetSteps } from '@/api/steps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const [profile, setProfile] = useState({
    gender: 'Homme',
    height: '180',
    stepLength: '75',
    dailyGoal: '10000',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      setProfile({
        gender: data.gender,
        height: data.height.toString(),
        stepLength: data.stepLength.toString(),
        dailyGoal: data.dailyGoal.toString(),
      });
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUserProfile({
        gender: profile.gender,
        height: parseInt(profile.height),
        stepLength: parseInt(profile.stepLength),
        dailyGoal: parseInt(profile.dailyGoal),
      });
      Alert.alert('Succès', 'Profil mis à jour avec succès.');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    Alert.alert(
      'Réinitialiser les données',
      'Êtes-vous sûr de vouloir supprimer tout l\'historique des pas ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Réinitialiser', 
          style: 'destructive',
          onPress: async () => {
            await resetSteps();
            Alert.alert('Succès', 'Données réinitialisées.');
          }
        },
      ]
    );
  };

  return (
    <ScreenWrapper>
      <AppHeader title="Configuration" showSync={false} />

      <Card>
        <Text style={[typography.h3, { marginBottom: spacing.lg }]}>Votre Profil</Text>
        
        <View style={styles.genderRow}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              profile.gender === 'Homme' && styles.genderButtonActive,
            ]}
            onPress={() => setProfile({ ...profile, gender: 'Homme' })}
          >
            <MaterialCommunityIcons 
              name="human-male" 
              size={24} 
              color={profile.gender === 'Homme' ? theme.colors.onPrimary : theme.colors.onSurfaceVariant} 
            />
            <Text style={[
              typography.body, 
              { marginLeft: spacing.sm },
              profile.gender === 'Homme' ? { color: theme.colors.onPrimary } : { color: theme.colors.onSurfaceVariant }
            ]}>Homme</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              profile.gender === 'Femme' && styles.genderButtonActive,
            ]}
            onPress={() => setProfile({ ...profile, gender: 'Femme' })}
          >
            <MaterialCommunityIcons 
              name="human-female" 
              size={24} 
              color={profile.gender === 'Femme' ? theme.colors.onPrimary : theme.colors.onSurfaceVariant} 
            />
            <Text style={[
              typography.body, 
              { marginLeft: spacing.sm },
              profile.gender === 'Femme' ? { color: theme.colors.onPrimary } : { color: theme.colors.onSurfaceVariant }
            ]}>Femme</Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Taille"
          value={profile.height}
          onChangeText={(text) => setProfile({ ...profile, height: text })}
          keyboardType="numeric"
          suffix="cm"
        />

        <Input
          label="Objectif quotidien"
          value={profile.dailyGoal}
          onChangeText={(text) => setProfile({ ...profile, dailyGoal: text })}
          keyboardType="numeric"
          suffix="pas"
        />
      </Card>

      <Card>
        <Text style={[typography.h3, { marginBottom: spacing.lg }]}>Etalonnage du Podomètre</Text>
        <Input
          label="Longueur de pas moyenne"
          value={profile.stepLength}
          onChangeText={(text) => setProfile({ ...profile, stepLength: text })}
          keyboardType="numeric"
          suffix="cm"
        />
        <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant, marginTop: -spacing.sm }]}>
          Calibrez la longueur de vos pas pour un calcul plus précis de la distance.
        </Text>
      </Card>

      <View style={{ paddingHorizontal: spacing.lg, gap: spacing.md }}>
        <Button title="Enregistrer les modifications" onPress={handleSave} loading={loading} />
        
        <Card style={styles.storageCard}>
          <View style={styles.storageHeader}>
            <MaterialCommunityIcons name="database-outline" size={24} color={theme.colors.onSurface} />
            <Text style={[typography.h3, { marginLeft: spacing.sm }]}>Gestion des données</Text>
          </View>
          <Text style={[typography.caption, { color: theme.colors.onSurfaceVariant, marginBottom: spacing.md }]}>
            État de la base de données : <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>Active (SQLite)</Text>
          </Text>
          <Button 
            title="Réinitialiser toutes les données" 
            variant="danger" 
            onPress={handleReset} 
            style={{ height: 40 }}
          />
        </Card>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  genderRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surfaceVariant,
  },
  genderButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  storageCard: {
    marginHorizontal: 0,
    marginTop: spacing.md,
  },
  storageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
});
