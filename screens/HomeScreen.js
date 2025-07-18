import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen({ onLogout }) {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const teamMembers = [
    {
      id: 1,
      name: "Francisco Cervantes",
      role: "FullStack Developer",
      image: require('../assets/fco 2.png')
    },
    {
      id: 6,
      name: "Ramona",
      role: "Apoyo Técnico",
      image: require('../assets/pug.jpeg')
    },
    {
      id: 2,
      name: "Jared Hernández",  
      role: "Frontend Specialist",
      image: require('../assets/jared.webp')
    },
    {
      id: 3,
      name: "Marshall Mohamed Nava",
      role: "IOT Engineer",
      image: require('../assets/marcial.jpeg')
    },
    {
      id: 4,
      name: " Eduardo Dario",
      role: "MongoBD Designer",
      image: require('../assets/dario.webp')
    },
    {
      id: 5,
      name: "Cesar Luis",
      role: "DevOps Engineer",
      image: require('../assets/cesar.png')
    }
  ];

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    setCurrentIndex(index);
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 1)', flex: 1 }]}>
      <Image
        source={require('../assets/header-trees.png')}
        style={[styles.headerImage, { height: 420, position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 0 }]}
        blurRadius={0}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 0 }}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <Text style={{ fontSize: 24, color: '#fff' }}>☰</Text>
        </TouchableOpacity>

        <View style={[styles.content, { zIndex: 1 }]}>
          <Text style={[styles.subtitle, { color: '#fff' }]}>BIENVENIDO</Text>
          <Text style={[styles.title, { color: '#fff' }]}>
            Plataforma Inteligente de Monitoreo Agrícola para <Text style={styles.green}>Nogalera</Text>
          </Text>
          <Text style={[styles.description, { color: '#ccc' }]}>
            La conservación forestal enfrenta numerosos desafíos críticos, tales como la detección tardía de incendios,
            la pérdida de biodiversidad, la deforestación y la degradación ambiental.
          </Text>

          <View style={styles.profileCard}>
            <Text style={[styles.profileTitle, { color: '#fff' }]}>NUESTRO EQUIPO</Text>
            
            {/* Carrusel mejorado */}
            <View style={styles.carouselContainer}>
              <ScrollView 
                horizontal 
                pagingEnabled 
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
              >
                {teamMembers.map((member) => (
                  <View key={member.id} style={styles.carouselItem}>
                    <Image
                      source={member.image}
                      style={styles.carouselImage}
                      resizeMode="cover"
                    />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
              <View style={styles.indicatorContainer}>
                {teamMembers.map((_, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.indicator,
                      index === currentIndex && styles.activeIndicator
                    ]} 
                  />
                ))}
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F2F2F2' },
  menuButton: {
    padding: 10,
    marginLeft: 10,
    marginTop: 10,
    zIndex: 2,
  },
  headerImage: { width: '100%', height: 100, resizeMode: 'cover' },
  content: { padding: 24 },
  subtitle: { 
    color: '#fff', 
    fontSize: 12, 
    textAlign: 'left', 
    alignSelf: 'flex-start',
    letterSpacing: 1,
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginVertical: 10, 
    textAlign: 'left', 
    alignSelf: 'flex-start',
    lineHeight: 30,
  },
  green: { color: '#4A9A2C' },
  description: { 
    fontSize: 14, 
    color: '#ccc', 
    marginBottom: 20, 
    textAlign: 'left', 
    alignSelf: 'flex-start',
    lineHeight: 20,
  },
  profileCard: {
    backgroundColor: '#101010',
    borderRadius: 16,
    marginTop: 30,
    padding: 20,
    borderWidth: 2,
    borderColor: '#88684C',
  },
  profileTitle: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  carouselContainer: {
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  carouselItem: {
    width: screenWidth - 48,
    height: 250,
    alignItems: 'center',
  },
  carouselImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  memberInfo: {
    marginTop: 12,
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#4A9A2C',
    fontStyle: 'italic',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#555',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#4A9A2C',
    width: 16,
  },
  logoutButton: {
    marginTop: 40,
    alignSelf: 'center',
    backgroundColor: '#C04A4A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});