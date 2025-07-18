import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.contentContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>¿Quiénes Somos?</Text>
        <Text style={styles.description}>
          Somos un equipo apasionado por la tecnología y la innovación que busca transformar el mundo digital.
        </Text>

        {/* Profile 1 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileTitle}>Fundador</Text>
            <Text style={styles.profileName}>Jose Malacara</Text>
            <Text style={styles.role}>Dueño de la Nogalera</Text>
          </View>
        </View>

        {/* Profile 2 */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileTitle}>Co-Fundador</Text>
            <Text style={styles.profileName}>Pedro Said</Text>
            <Text style={styles.role}>Contacto de Referencia</Text>
          </View>
        </View>

        {/* Profile 3 - New */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileTitle}>Ingeniero Agrónomo</Text>
            <Text style={styles.profileName}>María González</Text>
            <Text style={styles.role}>Especialista en Nogales</Text>
          </View>
        </View>

        {/* Profile 4 - New */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileTitle}>Desarrollador</Text>
            <Text style={styles.profileName}>Carlos Mendoza</Text>
            <Text style={styles.role}>Sistemas de Monitoreo</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    marginTop: 60,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: '#000000',
  },
  title: {
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'flex-start',
    color: '#c0945b',
    fontSize: 42,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#E0D6C6',
    marginBottom: 30,
    textAlign: 'left',
    alignSelf: 'flex-start',
    lineHeight: 24,
  },
  profileCard: {
    backgroundColor: '#110E0A',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#88684C',
    width: '100%',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2A241B',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#88684C',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileTitle: {
    fontWeight: 'bold',
    color: '#CFCFCF',
    fontSize: 14,
    marginBottom: 4,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 6,
  },
  role: {
    backgroundColor: '#222',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(32, 32, 32, 0.87)',
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
});